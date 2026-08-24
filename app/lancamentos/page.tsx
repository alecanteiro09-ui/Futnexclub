import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product } from "@/types";

export const metadata = { title: "Lançamentos" };

async function getNewProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, images:product_images(*), team:teams(*)")
    .eq("is_active", true)
    .eq("is_new", true);
  return (data ?? []) as unknown as Product[];
}

export default async function LancamentosPage() {
  const products = await getNewProducts();
  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Lançamentos</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center text-ink-muted">Nenhum lançamento ainda.</div>
      )}
    </div>
  );
}
