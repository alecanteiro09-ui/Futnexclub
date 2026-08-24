import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { getFeaturedTeams, getBestSellerProducts } from "@/lib/data";
import { TeamCard } from "@/components/catalog/TeamCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { KitOfferSection } from "@/components/catalog/KitOfferSection";
import { ProductImagePlaceholder } from "@/components/ui/Placeholders";

const CATEGORY_LINKS = [
  { emoji: "🇧🇷", label: "Brasil", href: "/catalogo?regiao=brasil" },
  { emoji: "🇪🇺", label: "Europa", href: "/catalogo?regiao=europa" },
  { emoji: "🌎", label: "Seleções", href: "/catalogo?regiao=selecoes" },
  { emoji: "🕰️", label: "Retrô", href: "/colecoes/retro" },
  { emoji: "🔥", label: "Mais vendidas", href: "/mais-vendidas" },
  { emoji: "🆕", label: "Lançamentos", href: "/lancamentos" },
];

export default async function HomePage() {
  const [teams, bestSellers] = await Promise.all([getFeaturedTeams(12), getBestSellerProducts(8)]);

  return (
    <>
      {/* PRIMEIRA DOBRA */}
      <section className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
            Futnex Club
          </p>
          <h1 className="h1-display">SEU TIME. SEU NOME. SUA CAMISA.</h1>
          <p className="mt-6 text-lg text-ink-muted">
            Escolha seu time, personalize do seu jeito e encontre o próximo manto para chamar de seu.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/catalogo" className="btn-primary">
              Explorar camisas <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/mais-vendidas" className="btn-secondary">
              Ver mais vendidas
            </Link>
          </div>
        </div>

        <div className="relative">
          <ProductImagePlaceholder className="lg:aspect-[4/5]" />
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container-app py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-2 rounded-xl border border-base-border bg-base-soft px-4 py-4 text-sm font-semibold transition-colors hover:border-accent/40"
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* KIT */}
      <KitOfferSection />

      {/* TIMES */}
      <section className="container-app py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="h2-display">Escolha seu time</h2>
          <Link href="/times" className="text-sm font-semibold text-accent hover:underline">
            Ver todos
          </Link>
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <EmptyStateCatalog />
        )}
      </section>

      {/* MAIS VENDIDAS */}
      {bestSellers.length > 0 && (
        <section className="container-app py-16">
          <div className="mb-8 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="h2-display">Mais vendidas</h2>
            </div>
            <Link href="/mais-vendidas" className="text-sm font-semibold text-accent hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function EmptyStateCatalog() {
  return (
    <div className="card-surface flex flex-col items-center gap-3 p-12 text-center">
      <p className="font-display text-lg font-bold">Estamos preparando o catálogo.</p>
      <p className="text-sm text-ink-muted">
        Conecte o Supabase e rode o seed para ver os times aparecerem aqui.
      </p>
    </div>
  );
}
