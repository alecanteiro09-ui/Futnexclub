"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface BannerFormState {
  error?: string;
}

export async function createBanner(_prev: BannerFormState, formData: FormData): Promise<BannerFormState> {
  const supabase = createClient();

  const imageUrl = String(formData.get("image_url") ?? "");
  if (!imageUrl) return { error: "Faça upload de uma imagem." };

  const { error } = await supabase.from("banners").insert({
    image_url: imageUrl,
    title: String(formData.get("title") ?? "") || null,
    subtitle: String(formData.get("subtitle") ?? "") || null,
    cta_label: String(formData.get("cta_label") ?? "") || null,
    link: String(formData.get("link") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  return {};
}

export async function deleteBanner(bannerId: string) {
  const supabase = createClient();
  await supabase.from("banners").delete().eq("id", bannerId);
  revalidatePath("/admin/banners");
}

export async function toggleBanner(bannerId: string, isActive: boolean) {
  const supabase = createClient();
  await supabase.from("banners").update({ is_active: isActive }).eq("id", bannerId);
  revalidatePath("/admin/banners");
}
