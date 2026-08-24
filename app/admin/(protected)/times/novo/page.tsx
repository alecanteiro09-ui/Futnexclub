import { TeamForm } from "@/components/admin/TeamForm";
import { createTeam } from "@/lib/actions/teams";

export default function NovoTimePage() {
  return (
    <div>
      <h1 className="h2-display mb-8">Novo time</h1>
      <TeamForm action={createTeam} />
    </div>
  );
}
