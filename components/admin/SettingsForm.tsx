"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Settings } from "@/types";
import { updateGeneralSettings, SettingsFormState } from "@/lib/actions/settings";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [state, formAction] = useFormState<SettingsFormState, FormData>(updateGeneralSettings, {});
  const [logo, setLogo] = useState<string[]>(settings?.logo_url ? [settings.logo_url] : []);
  const [favicon, setFavicon] = useState<string[]>(settings?.favicon_url ? [settings.favicon_url] : []);

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      <input type="hidden" name="logo_url" value={logo[0] ?? ""} />
      <input type="hidden" name="favicon_url" value={favicon[0] ?? ""} />

      <div className="grid grid-cols-2 gap-6">
        <ImageUploader bucket="banners" pathPrefix="branding/logo" value={logo} onChange={setLogo} label="Logo principal" />
        <ImageUploader bucket="banners" pathPrefix="branding/favicon" value={favicon} onChange={setFavicon} label="Favicon" />
      </div>

      <Field label="Nome da marca" name="brand_name" defaultValue={settings?.brand_name ?? "Futnex Club"} />
      <Field label="Slogan" name="slogan" defaultValue={settings?.slogan ?? "Seu time. Seu nome. Sua camisa."} />

      <Field
        label="WhatsApp (E.164, sem +)"
        name="whatsapp_number"
        defaultValue={settings?.whatsapp_number ?? ""}
        placeholder="5511999999999"
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Instagram" name="instagram" defaultValue={settings?.instagram ?? ""} placeholder="@futnexclub" />
        <Field label="TikTok" name="tiktok" defaultValue={settings?.tiktok ?? ""} placeholder="@futnexclub" />
      </div>

      <Field label="E-mail" name="email" defaultValue={settings?.email ?? ""} type="email" />
      <Field label="Prazo de entrega" name="delivery_time_label" defaultValue={settings?.delivery_time_label ?? "15 a 20 dias úteis"} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Configurações salvas!</p>}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Salvando..." : "Salvar configurações"}
    </button>
  );
}
