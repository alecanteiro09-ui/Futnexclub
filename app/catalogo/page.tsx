import { getBestSellerProducts } from "@/lib/data";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Encontre seu manto: escolha o time e personalize sua camisa.",
};

const FILTERS = ["Todos", "Brasil", "Europa", "Seleções", "Retrô", "Mais vendidos", "Lançamentos"];

export default async function CatalogoPage() {
  // TODO (Fase 6): ligar filtros reais por continente/liga/coleção via searchParams
  const products = await getBestSellerProducts(24);

  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Encontre seu manto</h1>

      <div className="relative mt-8 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Qual é o seu time?"
          className="w-full rounded-xl border border-base-border bg-base-soft py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === 0
                ? "bg-accent text-white"
                : "border border-base-border text-ink-muted hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <h2 className="h2-display mt-12 mb-6">Escolha seu time</h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-surface flex flex-col items-center gap-2 p-12 text-center">
          <p className="font-display text-lg font-bold">Não encontramos esse manto ainda.</p>
          <p className="text-sm text-ink-muted">Conecte o Supabase e cadastre produtos pelo /admin.</p>
        </div>
      )}
    </div>
  );
}
