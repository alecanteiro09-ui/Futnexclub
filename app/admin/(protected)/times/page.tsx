import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Team } from "@/types";

async function getAllTeams(): Promise<Team[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = createClient();
  const { data } = await supabase.from("teams").select("*").order("sort_order");
  return (data ?? []) as Team[];
}

export default async function AdminTimesPage() {
  const teams = await getAllTeams();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="h2-display">Times</h1>
        <Link href="/admin/times/novo" className="btn-primary">
          <Plus className="h-4 w-4" /> Adicionar time
        </Link>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-border text-ink-muted">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">País</th>
              <th className="p-4">Liga</th>
              <th className="p-4">Status</th>
              <th className="p-4">Logo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-base-border last:border-0">
                <td className="p-4 font-medium">{team.name}</td>
                <td className="p-4 text-ink-muted">{team.country ?? "-"}</td>
                <td className="p-4 text-ink-muted">{team.league ?? "-"}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${team.is_active ? "bg-success/15 text-success" : "bg-ink-muted/15 text-ink-muted"}`}>
                    {team.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4 text-ink-muted">{team.logo_url ? "✓" : "Sem logo"}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/times/${team.id}/editar`} className="text-sm font-semibold text-accent hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-muted">
                  Nenhum time encontrado. Conecte o Supabase e rode supabase/seed.sql.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
