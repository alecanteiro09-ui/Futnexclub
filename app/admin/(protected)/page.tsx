import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { products: 0, teams: 0, collections: 0, featured: 0, bestSellers: 0, orders: 0 };
  }
  const supabase = createClient();
  const [{ count: products }, { count: teams }, { count: collections }, { count: featured }, { count: bestSellers }, { count: orders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("collections").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_featured", true),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_best_seller", true),
      supabase.from("orders").select("*", { count: "exact", head: true }),
    ]);

  return {
    products: products ?? 0,
    teams: teams ?? 0,
    collections: collections ?? 0,
    featured: featured ?? 0,
    bestSellers: bestSellers ?? 0,
    orders: orders ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Total de produtos", value: counts.products },
    { label: "Total de times", value: counts.teams },
    { label: "Total de coleções", value: counts.collections },
    { label: "Produtos em destaque", value: counts.featured },
    { label: "Mais vendidos", value: counts.bestSellers },
    { label: "Pedidos iniciados", value: counts.orders },
  ];

  return (
    <div>
      <h1 className="h2-display mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card-surface p-6">
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Cliques no WhatsApp e produtos mais acessados aparecem aqui assim que a camada de
        analytics (seção 49) for conectada a um provedor de eventos.
      </p>
    </div>
  );
}
