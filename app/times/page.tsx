import { getFeaturedTeams } from "@/lib/data";
import { TeamCard } from "@/components/catalog/TeamCard";

export const metadata = { title: "Times" };

export default async function TimesIndexPage() {
  const teams = await getFeaturedTeams(200);

  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Todos os times</h1>
      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      {teams.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center text-ink-muted">
          Nenhum time cadastrado ainda. Conecte o Supabase e rode supabase/seed.sql.
        </div>
      )}
    </div>
  );
}
