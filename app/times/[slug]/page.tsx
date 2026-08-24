import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getTeamBySlug, getProductsByTeam } from "@/lib/data";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TeamLogoPlaceholder } from "@/components/ui/Placeholders";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const team = await getTeamBySlug(params.slug);
  if (!team) return {};
  return {
    title: `Camisas do ${team.name}`,
    description: `Escolha seu modelo do ${team.name} e personalize com seu nome e número.`,
  };
}

const FILTERS = ["Todos", "2026", "Casa", "Fora", "Alternativa", "Retrô"];

export default async function TeamPage({ params }: Props) {
  const team = await getTeamBySlug(params.slug);
  if (!team) notFound();

  const products = await getProductsByTeam(team.id);

  return (
    <div className="container-app py-12">
      <div className="flex items-center gap-4">
        {team.logo_url ? (
          <div className="relative h-16 w-16">
            <Image src={team.logo_url} alt={team.name} fill className="object-contain" />
          </div>
        ) : (
          <TeamLogoPlaceholder className="h-16 w-16" />
        )}
        <div>
          <h1 className="h1-display text-3xl lg:text-4xl">{team.name}</h1>
          <p className="text-ink-muted">Escolha seu modelo.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === 0 ? "bg-accent text-white" : "border border-base-border text-ink-muted hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card-surface flex flex-col items-center gap-2 p-12 text-center">
            <p className="font-display text-lg font-bold">Estamos preparando os mantos desse time.</p>
            <a href="/times" className="mt-2 text-sm font-semibold text-accent hover:underline">
              Ver outros times
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
