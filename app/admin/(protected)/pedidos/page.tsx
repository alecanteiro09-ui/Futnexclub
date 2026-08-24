import { createClient } from "@/lib/supabase/server";

async function getRecentOrders() {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  em_producao: "Em produção",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function AdminPedidosPage() {
  const orders = await getRecentOrders();

  return (
    <div>
      <h1 className="h2-display mb-2">Pedidos</h1>
      <p className="mb-8 text-sm text-ink-muted">
        Criados automaticamente quando o cliente clica em "Pedir pelo WhatsApp". O pagamento
        e o status seguem sendo controlados manualmente pelo vendedor na conversa.
      </p>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-border text-ink-muted">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Itens</th>
              <th className="p-4">Total</th>
              <th className="p-4">Origem</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(orders as any[]).map((order) => (
              <tr key={order.id} className="border-b border-base-border last:border-0 align-top">
                <td className="p-4 text-ink-muted">{new Date(order.created_at).toLocaleString("pt-BR")}</td>
                <td className="p-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="text-xs text-ink-muted">
                      {item.team_name} · {item.product_name} · {item.custom_name || "s/nome"} {item.custom_number ?? ""} · {item.size_code}
                    </div>
                  ))}
                </td>
                <td className="p-4 font-semibold">R$ {Number(order.total).toFixed(2)}</td>
                <td className="p-4 text-xs text-ink-muted">{order.utm_source ?? "direto"}</td>
                <td className="p-4">
                  <span className="rounded-full bg-ink-muted/15 px-2 py-1 text-xs font-semibold text-ink-muted">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-muted">
                  Nenhum pedido registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
