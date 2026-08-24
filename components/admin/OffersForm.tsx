"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Settings } from "@/types";
import { updateOffers, SettingsFormState } from "@/lib/actions/settings";

export function OffersForm({ settings }: { settings: Settings | null }) {
  const [state, formAction] = useFormState<SettingsFormState, FormData>(updateOffers, {});

  return (
    <form action={formAction} className="max-w-lg space-y-6">
      <PriceField label="Preço — 1 camisa" name="one_shirt_price" defaultValue={settings?.one_shirt_price ?? 149.9} />
      <PriceField label="Preço — 2 camisas" name="two_shirt_price" defaultValue={settings?.two_shirt_price ?? 229.99} />
      <PriceField label="Preço — 3 camisas" name="three_shirt_price" defaultValue={settings?.three_shirt_price ?? 349.99} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Preços atualizados!</p>}

      <SubmitButton />
    </form>
  );
}

function PriceField({ label, name, defaultValue }: { label: string; name: string; defaultValue: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-muted">R$</span>
        <input
          type="number"
          step="0.01"
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-base-border bg-base py-3 pl-11 pr-4 text-sm text-ink focus:border-accent"
        />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Salvando..." : "Salvar preços"}
    </button>
  );
}
