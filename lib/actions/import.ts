"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { parseProductImportCsv, hasBlockingIssues } from "@/lib/import/productImport";

const MAX_GROUPS = 200;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;

export interface ImportRowResult {
  key: string;
  title: string;
  status: "created" | "updated" | "error";
  productId?: string;
  slug?: string;
  messages: string[];
}

export interface ImportSummary {
  error?: string;
  totalGroups: number;
  created: number;
  updated: number;
  failed: number;
  results: ImportRowResult[];
}

function randomToken(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

type SupabaseClient = ReturnType<typeof createClient>;

async function resolveTeamId(
  supabase: SupabaseClient,
  teamName: string,
  cache: Map<string, { id: string; created: boolean }>
): Promise<{ id: string; created: boolean } | null> {
  const key = teamName.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const { data: existing } = await supabase.from("teams").select("id").ilike("name", teamName.trim()).limit(1).maybeSingle();
  if (existing) {
    const result = { id: existing.id as string, created: false };
    cache.set(key, result);
    return result;
  }

  const { data: created, error } = await supabase
    .from("teams")
    .insert({ name: teamName.trim(), slug: slugify(teamName) + "-" + randomToken().slice(0, 6), is_active: true })
    .select("id")
    .single();

  if (error || !created) return null;
  const result = { id: created.id as string, created: true };
  cache.set(key, result);
  return result;
}

async function downloadAndUploadImage(supabase: SupabaseClient, productId: string, url: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(parsed.toString(), { signal: controller.signal });
    if (!res.ok) return null;

    const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!contentType.startsWith("image/")) return null;

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > MAX_IMAGE_BYTES) return null;
    const buffer = Buffer.from(arrayBuffer);

    const ext = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1] || "jpg";
    const fileName = `products/${productId}/${randomToken()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("products").upload(fileName, buffer, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) return null;

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function importProducts(_prev: ImportSummary, formData: FormData): Promise<ImportSummary> {
  const supabase = createClient();

  const file = formData.get("csv_file");
  if (!(file instanceof File) || file.size === 0) {
    return { totalGroups: 0, created: 0, updated: 0, failed: 0, results: [], error: "Selecione um arquivo CSV." };
  }

  const text = await file.text();
  const parsed = parseProductImportCsv(text);

  if (parsed.fatalError) {
    return { totalGroups: 0, created: 0, updated: 0, failed: 0, results: [], error: parsed.fatalError };
  }
  if (parsed.groups.length === 0) {
    return { totalGroups: 0, created: 0, updated: 0, failed: 0, results: [], error: "Nenhum produto encontrado no arquivo." };
  }
  if (parsed.groups.length > MAX_GROUPS) {
    return {
      totalGroups: parsed.groups.length,
      created: 0,
      updated: 0,
      failed: 0,
      results: [],
      error: `O arquivo tem ${parsed.groups.length} produtos. Divida em arquivos de até ${MAX_GROUPS} para evitar timeout do servidor.`,
    };
  }

  const teamCache = new Map<string, { id: string; created: boolean }>();
  const usedSlugs = new Set<string>();
  const results: ImportRowResult[] = [];
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const group of parsed.groups) {
    const messages = group.issues.map((i) => i.message);

    if (hasBlockingIssues(group)) {
      failed++;
      results.push({ key: group.key, title: group.title || group.key, status: "error", messages });
      continue;
    }

    const team = await resolveTeamId(supabase, group.teamName, teamCache);
    if (!team) {
      failed++;
      results.push({
        key: group.key,
        title: group.title,
        status: "error",
        messages: [...messages, `Não foi possível localizar/criar o time "${group.teamName}".`],
      });
      continue;
    }
    if (team.created) messages.push(`Time "${group.teamName}" criado automaticamente.`);

    let baseSlug = slugify(`${group.title}-${group.teamName}-${group.season ?? ""}`);
    if (!baseSlug) baseSlug = slugify(group.title) || group.key;
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    usedSlugs.add(slug);

    const { data: existingProduct } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();

    const payload = {
      name: group.title,
      team_id: team.id,
      season: group.season,
      category: group.category,
      description: group.description,
      price: group.price,
      compare_at_price: group.compareAtPrice,
      is_active: group.isActive,
      is_featured: group.isFeatured,
      is_best_seller: group.isBestSeller,
      is_new: group.isNew,
      allow_custom_name: group.allowCustomName,
      allow_custom_number: group.allowCustomNumber,
      max_name_characters: group.maxNameCharacters,
      min_number: group.minNumber,
      max_number: group.maxNumber,
      updated_at: new Date().toISOString(),
    };

    let productId: string;
    let status: "created" | "updated";

    if (existingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", existingProduct.id);
      if (error) {
        failed++;
        results.push({ key: group.key, title: group.title, status: "error", messages: [...messages, error.message] });
        continue;
      }
      productId = existingProduct.id;
      status = "updated";
    } else {
      const { data: inserted, error } = await supabase
        .from("products")
        .insert({ ...payload, slug })
        .select("id")
        .single();
      if (error || !inserted) {
        failed++;
        results.push({ key: group.key, title: group.title, status: "error", messages: [...messages, error?.message ?? "Falha ao criar produto."] });
        continue;
      }
      productId = inserted.id;
      status = "created";
    }

    const uploadedUrls: string[] = [];
    for (const img of group.images) {
      const publicUrl = await downloadAndUploadImage(supabase, productId, img.url);
      if (publicUrl) uploadedUrls.push(publicUrl);
      else messages.push(`Falha ao baixar imagem: ${img.url}`);
    }
    if (uploadedUrls.length > 0) {
      await supabase.from("product_images").delete().eq("product_id", productId);
      await supabase.from("product_images").insert(
        uploadedUrls.map((url, index) => ({ product_id: productId, image_url: url, sort_order: index, is_primary: index === 0 }))
      );
    }

    await supabase.from("product_sizes").delete().eq("product_id", productId);
    if (group.sizes.length > 0) {
      await supabase.from("product_sizes").insert(group.sizes.map((size) => ({ product_id: productId, size_code: size, is_available: true })));
    }

    if (status === "created") created++;
    else updated++;
    results.push({ key: group.key, title: group.title, status, productId, slug, messages });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/admin/times");
  revalidatePath("/catalogo");

  return { totalGroups: parsed.groups.length, created, updated, failed, results };
}
