"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateOffers(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const supabase = createClient();

  const { error } = await supabase
    .from("settings")
    .update({
      one_shirt_price: Number(formData.get("one_shirt_price") ?? 149.9),
      two_shirt_price: Number(formData.get("two_shirt_price") ?? 229.99),
      three_shirt_price: Number(formData.get("three_shirt_price") ?? 349.99),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/ofertas");
  revalidatePath("/");
  return { success: true };
}

export async function updateGeneralSettings(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const supabase = createClient();

  const { error } = await supabase
    .from("settings")
    .update({
      brand_name: String(formData.get("brand_name") ?? "Futnex Club"),
      slogan: String(formData.get("slogan") ?? ""),
      whatsapp_number: String(formData.get("whatsapp_number") ?? ""),
      instagram: String(formData.get("instagram") ?? "") || null,
      tiktok: String(formData.get("tiktok") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      delivery_time_label: String(formData.get("delivery_time_label") ?? "15 a 20 dias úteis"),
      logo_url: String(formData.get("logo_url") ?? "") || null,
      favicon_url: String(formData.get("favicon_url") ?? "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  return { success: true };
}
