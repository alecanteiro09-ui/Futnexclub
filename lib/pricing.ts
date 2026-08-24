/**
 * Regras de preço centralizadas (ver seção 39 do briefing).
 * KIT_PRICING é o fallback padrão (usado no seed e quando o Supabase ainda não
 * está configurado). Assim que /admin/ofertas grava a tabela `settings`, ela
 * passa a ser a fonte da verdade — ver getKitPricing() abaixo.
 */
export const KIT_PRICING = {
  1: 149.9,
  2: 229.99,
  3: 349.99,
} as const;

export type KitSize = keyof typeof KIT_PRICING;

export function getKitPrice(quantity: KitSize): number {
  return KIT_PRICING[quantity];
}

/** Versão client-side (browser), usada em componentes "use client" como o carrinho e o WhatsApp. */
export async function getKitPricingFromSettingsClient(): Promise<Record<KitSize, number>> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
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

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const KIT_BENEFITS = ["Personalização incluída", "Frete grátis"] as const;

export const DELIVERY_TIME_LABEL_DEFAULT = "15 a 20 dias úteis";
