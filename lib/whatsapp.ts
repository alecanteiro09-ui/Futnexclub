import { KitItemDraft } from "@/types";
import { formatBRL, getKitPricingFromSettingsClient, KitSize } from "@/lib/pricing";

/**
 * Número de WhatsApp da loja. Prioriza o valor salvo em /admin/configuracoes
 * (tabela settings); cai para a variável de ambiente se não houver nada salvo.
 * Nunca hardcoded diretamente em componentes (ver proibições, seção 78).
 */
export async function getWhatsAppNumber(): Promise<string> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("whatsapp_number").eq("id", 1).single();
    if (data?.whatsapp_number) return data.whatsapp_number;
  } catch {
    // segue para o fallback de env
  }

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) {
    console.warn("Nenhum número de WhatsApp configurado (settings ou NEXT_PUBLIC_WHATSAPP_NUMBER).");
    return "";
  }
  return number;
}

interface BuildOrderMessageParams {
  items: KitItemDraft[];
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;
}

export async function buildOrderMessage({ items, utm }: BuildOrderMessageParams): Promise<string> {
  const quantity = items.length as KitSize;
  const prices = await getKitPricingFromSettingsClient();
  const total = quantity >= 1 && quantity <= 3 ? prices[quantity] : 0;

  const lines: string[] = ["Olá! Quero fazer meu pedido na Futnex Club.", ""];

  items.forEach((item, index) => {
    lines.push(`Camisa ${index + 1}:`);
    lines.push(`Time: ${item.team?.name ?? "-"}`);
    lines.push(`Modelo: ${item.product?.name ?? "-"}`);
    lines.push(`Nome: ${item.customName || "Sem personalização"}`);
    lines.push(`Número: ${item.customNumber || "Sem personalização"}`);
    lines.push(`Tamanho: ${item.size ?? "-"}`);
    lines.push("");
  });

  lines.push(`Quantidade: ${quantity}`);
  lines.push(`Total: ${total ? formatBRL(total) : "-"}`);
  lines.push("");
  lines.push("Vim pelo catálogo.");

  if (utm && Object.values(utm).some(Boolean)) {
    lines.push("");
    lines.push(
      `(origem: ${utm.utm_source ?? "-"} / campanha: ${utm.utm_campaign ?? "-"})`
    );
  }

  return lines.join("\n");
}

export async function buildWhatsAppLink(message: string): Promise<string> {
  const number = await getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
