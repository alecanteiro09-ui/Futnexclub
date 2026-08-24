import { createClient } from "@/lib/supabase/server";
import { KIT_PRICING, KitSize } from "@/lib/pricing";

/**
 * Busca os preços atuais direto do Supabase (settings). Cai no fallback estático se falhar.
 * ATENÇÃO: este arquivo importa lib/supabase/server (que usa next/headers) — só pode ser
 * importado por Server Components ou Server Actions, NUNCA por um arquivo com "use client".
 */
export async function getKitPricingFromSettings(): Promise<Record<KitSize, number>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { ...KIT_PRICING };

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("settings")
      .select("one_shirt_price, two_shirt_price, three_shirt_price")
      .eq("id", 1)
      .single();

    if (!data) return { ...KIT_PRICING };

    return {
      1: Number(data.one_shirt_price),
      2: Number(data.two_shirt_price),
      3: Number(data.three_shirt_price),
    };
  } catch {
    return { ...KIT_PRICING };
  }
}
