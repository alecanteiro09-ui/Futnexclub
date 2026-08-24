"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface TeamFormState {
  error?: string;
}

export async function createTeam(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Nome é obrigatório." };

  const logoUrl = String(formData.get("logo_url") ?? "") || null;

  const { data, error } = await supabase
    .from("teams")
    .insert({
      name,
      slug: slugify(name),
      country: String(formData.get("country") ?? "") || null,
      continent: String(formData.get("continent") ?? "") || null,
      league: String(formData.get("league") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      logo_url: logoUrl,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/times");
  revalidatePath("/times");
  redirect(`/admin/times/${data.id}/editar?created=1`);
}

export async function updateTeam(teamId: string, _prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Nome é obrigatório." };

  const { error } = await supabase
    .from("teams")
    .update({
      name,
      country: String(formData.get("country") ?? "") || null,
      continent: String(formData.get("continent") ?? "") || null,
      league: String(formData.get("league") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      logo_url: String(formData.get("logo_url") ?? "") || null,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
      updated_at: new Date().toISOString(),
    })
    .eq("id", teamId);

  if (error) return { error: error.message };

  revalidatePath("/admin/times");
  revalidatePath("/times");
  return {};
}

export async function deleteTeam(teamId: string) {
  const supabase = createClient();
  // Soft delete — evita quebrar produtos já vinculados (seção 84: time é entidade independente)
  await supabase.from("teams").update({ is_active: false }).eq("id", teamId);
  revalidatePath("/admin/times");
  revalidatePath("/times");
}
