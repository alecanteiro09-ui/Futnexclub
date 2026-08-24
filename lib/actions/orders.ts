"use server";

import { createClient } from "@/lib/supabase/server";
import { KitItemDraft } from "@/types";

interface RegisterOrderInput {
  items: KitItemDraft[];
  total: number;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;
}

/**
 * Registra o pedido no momento do clique em WhatsApp (seção 61).
 * O pagamento continua sendo finalizado manualmente pelo vendedor — isso só
 * cria o rastro em /admin/pedidos e permite medir cliques por campanha.
 */
export async function registerOrder({ items, total, utm }: RegisterOrderInput) {
  if (items.length === 0) return;

  try {
    const supabase = createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        quantity: items.length,
        total,
        utm_source: utm?.utm_source ?? null,
        utm_medium: utm?.utm_medium ?? null,
        utm_campaign: utm?.utm_campaign ?? null,
        utm_content: utm?.utm_content ?? null,
        utm_term: utm?.utm_term ?? null,
        status: "novo",
      })
      .select("id")
      .single();

    if (error || !order) return;

    const rows = items.map((item) => ({
      order_id: order.id,
      product_id: item.product?.id ?? null,
      product_name: item.product?.name ?? "-",
      team_name: item.team?.name ?? "-",
      image_url: item.imageUrl,
      custom_name: item.customName || null,
      custom_number: item.customNumber ? Number(item.customNumber) : null,
      size_code: item.size,
    }));

    await supabase.from("order_items").insert(rows);
  } catch {
    // Falha silenciosa — nunca deve impedir o cliente de chegar ao WhatsApp
  }
}
