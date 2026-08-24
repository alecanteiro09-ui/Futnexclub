import Link from "next/link";
import Image from "next/image";
import { Team } from "@/types";
import { TeamLogoPlaceholder } from "@/components/ui/Placeholders";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/times/${team.slug}`}
      className="flex flex-col items-center gap-3 rounded-2xl border border-base-border bg-base-soft p-6 text-center transition-colors hover:border-accent/40"
    >
      {team.logo_url ? (
        <div className="relative h-12 w-12">
          <Image src={team.logo_url} alt={team.name} fill className="object-contain" />
        </div>
      ) : (
        <TeamLogoPlaceholder />
      )}
      <span className="text-sm font-semibold text-ink">{team.name}</span>
    </Link>
  );
}
