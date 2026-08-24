"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createBanner, BannerFormState } from "@/lib/actions/banners";

export function BannerForm() {
  const [state, formAction] = useFormState<BannerFormState, FormData>(createBanner, {});
  const [images, setImages] = useState<string[]>([]);

  return (
    <form
      action={(fd) => {
        formAction(fd);
        setImages([]); // limpa o form após submeter (o server action redireciona/revalida a lista)
      }}
      className="card-surface max-w-xl space-y-5 p-6"
    >
      <input type="hidden" name="image_url" value={images[0] ?? ""} />
      <ImageUploader bucket="banners" pathPrefix={`banners/${crypto.randomUUID().slice(0, 8)}`} value={images} onChange={setImages} label="Imagem do banner" />

      <Field label="Título" name="title" />
      <Field label="Subtítulo" name="subtitle" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Texto do CTA" name="cta_label" placeholder="Ver coleção" />
        <Field label="Link" name="link" placeholder="/colecoes/lancamentos" />
      </div>
      <Field label="Ordem" name="sort_order" type="number" defaultValue="0" />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", placeholder }: { label: string; name: string; defaultValue?: string; type?: string; placeholder?: string }) {
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
      {pending ? "Salvando..." : "Adicionar banner"}
    </button>
  );
}
