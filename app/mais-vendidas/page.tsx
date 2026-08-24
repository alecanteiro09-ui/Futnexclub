import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/types";

export const metadata = { title: "Mais Vendidas" };

async function getBestSellers(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, images:product_images(*), team:teams(*)")
    .eq("is_active", true)
    .eq("is_best_seller", true);
  return (data ?? []) as unknown as Product[];
}

export default async function MaisVendidasPage() {
  const products = await getBestSellers();
  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Mais vendidas</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center text-ink-muted">Nenhum produto em destaque ainda.</div>
      )}
    </div>
  );
}
