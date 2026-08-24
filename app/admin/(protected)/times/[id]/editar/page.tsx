import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "@/components/admin/TeamForm";
import { updateTeam } from "@/lib/actions/teams";
import { Team } from "@/types";

export default async function EditarTimePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: team } = await supabase.from("teams").select("*").eq("id", params.id).single();

  if (!team) notFound();

  const boundAction = updateTeam.bind(null, params.id);

  return (
    <div>
      <h1 className="h2-display mb-8">Editar {team.name}</h1>
      <TeamForm team={team as Team} action={boundAction} />
    </div>
  );
}
