"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { SizeLabel } from "@/types";

export interface ProductFormState {
  error?: string;
}

const ALL_SIZES: SizeLabel[] = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

function parseImages(formData: FormData): string[] {
  const raw = String(formData.get("images_json") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string") : [];
  } catch {
    return [];
  }
}

function parseSizes(formData: FormData): SizeLabel[] {
  return ALL_SIZES.filter((s) => formData.get(`size_${s}`) === "on");
}

async function syncImages(supabase: ReturnType<typeof createClient>, productId: string, urls: string[]) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (urls.length === 0) return;

  const rows = urls.map((url, index) => ({
    product_id: productId,
    image_url: url,
    sort_order: index,
    is_primary: index === 0,
  }));
  await supabase.from("product_images").insert(rows);
}

async function syncSizes(supabase: ReturnType<typeof createClient>, productId: string, sizes: SizeLabel[]) {
  await supabase.from("product_sizes").delete().eq("product_id", productId);
  if (sizes.length === 0) return;

  const rows = sizes.map((size) => ({ product_id: productId, size_code: size, is_available: true }));
  await supabase.from("product_sizes").insert(rows);
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  const teamId = String(formData.get("team_id") ?? "");
  if (!name) return { error: "Nome é obrigatório." };
  if (!teamId) return { error: "Selecione um time." };

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
      team_id: teamId,
      season: String(formData.get("season") ?? "") || null,
      category: String(formData.get("category") ?? "outro"),
      description: String(formData.get("description") ?? "") || null,
      price: Number(formData.get("price") ?? 149.9),
      compare_at_price: formData.get("compare_at_price") ? Number(formData.get("compare_at_price")) : null,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      is_best_seller: formData.get("is_best_seller") === "on",
      is_new: formData.get("is_new") === "on",
      allow_custom_name: formData.get("allow_custom_name") === "on",
      allow_custom_number: formData.get("allow_custom_number") === "on",
      max_name_characters: Number(formData.get("max_name_characters") ?? 12),
      min_number: Number(formData.get("min_number") ?? 1),
      max_number: Number(formData.get("max_number") ?? 99),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await syncImages(supabase, product.id, parseImages(formData));
  await syncSizes(supabase, product.id, parseSizes(formData));

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  redirect(`/admin/produtos/${product.id}/editar?created=1`);
}

export async function updateProduct(productId: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Nome é obrigatório." };

  const { error } = await supabase
    .from("products")
    .update({
      name,
      team_id: String(formData.get("team_id") ?? ""),
      season: String(formData.get("season") ?? "") || null,
      category: String(formData.get("category") ?? "outro"),
      description: String(formData.get("description") ?? "") || null,
      price: Number(formData.get("price") ?? 149.9),
      compare_at_price: formData.get("compare_at_price") ? Number(formData.get("compare_at_price")) : null,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      is_best_seller: formData.get("is_best_seller") === "on",
      is_new: formData.get("is_new") === "on",
      allow_custom_name: formData.get("allow_custom_name") === "on",
      allow_custom_number: formData.get("allow_custom_number") === "on",
      max_name_characters: Number(formData.get("max_name_characters") ?? 12),
      min_number: Number(formData.get("min_number") ?? 1),
      max_number: Number(formData.get("max_number") ?? 99),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) return { error: error.message };

  await syncImages(supabase, productId, parseImages(formData));
  await syncSizes(supabase, productId, parseSizes(formData));

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  return {};
}

export async function duplicateProduct(productId: string) {
  const supabase = createClient();
  const { data: original } = await supabase.from("products").select("*").eq("id", productId).single();
  if (!original) return;

  const { id, created_at, updated_at, slug, name, ...rest } = original;
  await supabase.from("products").insert({
    ...rest,
    name: `${name} (cópia)`,
    slug: slugify(name) + "-copia-" + Math.random().toString(36).slice(2, 6),
    is_active: false,
  });

  revalidatePath("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();
  await supabase.from("products").update({ is_active: false }).eq("id", productId);
  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
}
