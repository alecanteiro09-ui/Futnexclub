"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product, Team } from "@/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TeamCard } from "@/components/catalog/TeamCard";

export default function BuscaPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setTeams([]);
      setProducts([]);
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();

      const [{ data: teamResults }, { data: productResults }] = await Promise.all([
        supabase
          .from("teams")
          .select("*")
          .eq("is_active", true)
          .or(`name.ilike.%${query}%,country.ilike.%${query}%,league.ilike.%${query}%`)
          .limit(8),
        supabase
          .from("products")
          .select("*, images:product_images(*), team:teams(*)")
          .eq("is_active", true)
          .ilike("name", `%${query}%`)
          .limit(12),
      ]);

      setTeams((teamResults ?? []) as Team[]);
      setProducts((productResults ?? []) as unknown as Product[]);
      setLoading(false);
    }, 350); // debounce

    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Buscar</h1>

      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus
          type="search"
          placeholder="Qual é o seu time?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-base-border bg-base-soft py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
        />
      </div>

      {loading && <p className="mt-6 text-sm text-ink-muted">Buscando...</p>}

      {teams.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted">Times</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {teams.map((t) => <TeamCard key={t.id} team={t} />)}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted">Produtos</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {!loading && query.trim().length >= 2 && teams.length === 0 && products.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center text-ink-muted">
          Não encontramos esse manto ainda.
        </div>
      )}
    </div>
  );
}
