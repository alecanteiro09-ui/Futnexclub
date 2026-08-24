"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Team } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TeamFormState } from "@/lib/actions/teams";

type TeamAction = (prevState: TeamFormState, formData: FormData) => Promise<TeamFormState>;

export function TeamForm({ team, action }: { team?: Team; action: TeamAction }) {
  const [state, formAction] = useFormState<TeamFormState, FormData>(action, {});
  const [logoUrls, setLogoUrls] = useState<string[]>(team?.logo_url ? [team.logo_url] : []);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="logo_url" value={logoUrls[0] ?? ""} />

      <ImageUploader
        bucket="teams"
        pathPrefix={`teams/${team?.id ?? "novo-" + crypto.randomUUID().slice(0, 8)}`}
        value={logoUrls}
        onChange={setLogoUrls}
        label="Logo do time"
      />

      <Field label="Nome" name="name" defaultValue={team?.name} required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="País" name="country" defaultValue={team?.country ?? ""} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted">Continente</label>
          <select
            name="continent"
            defaultValue={team?.continent ?? ""}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
          >
            <option value="">Selecione</option>
            <option value="America do Sul">América do Sul</option>
            <option value="Europa">Europa</option>
            <option value="America do Norte">América do Norte</option>
            <option value="Africa">África</option>
            <option value="Asia">Ásia</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      <Field label="Liga" name="league" defaultValue={team?.league ?? ""} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">Descrição</label>
        <textarea
          name="description"
          defaultValue={team?.description ?? ""}
          rows={3}
          className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
        />
      </div>

      <Field label="Ordem" name="sort_order" type="number" defaultValue={String(team?.sort_order ?? 0)} />

      <div className="flex gap-6">
        <Checkbox label="Ativo" name="is_active" defaultChecked={team?.is_active ?? true} />
        <Checkbox label="Destaque" name="is_featured" defaultChecked={team?.is_featured ?? false} />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
      />
    </div>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-base-border accent-accent" />
      {label}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Salvando..." : "Salvar time"}
    </button>
  );
}
