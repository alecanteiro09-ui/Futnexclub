"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Product, Team, SizeLabel } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ProductFormState } from "@/lib/actions/products";

type ProductAction = (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;

const ALL_SIZES: SizeLabel[] = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

export function ProductForm({ product, teams, action }: { product?: Product; teams: Team[]; action: ProductAction }) {
  const [state, formAction] = useFormState<ProductFormState, FormData>(action, {});
  const [images, setImages] = useState<string[]>((product?.images ?? []).sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url));
  const [allowName, setAllowName] = useState(product?.allow_custom_name ?? true);
  const [allowNumber, setAllowNumber] = useState(product?.allow_custom_number ?? true);
  const selectedSizes = new Set((product?.sizes ?? []).filter((s) => s.is_available).map((s) => s.size));

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="images_json" value={JSON.stringify(images)} />

      <ImageUploader
        bucket="products"
        pathPrefix={`products/${product?.id ?? "novo-" + crypto.randomUUID().slice(0, 8)}`}
        value={images}
        onChange={setImages}
        multiple
        label="Imagens do produto (a primeira é a principal)"
      />

      <Field label="Nome do produto" name="name" defaultValue={product?.name} required placeholder="Flamengo I 2026" />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">Time</label>
        <select
          name="team_id"
          defaultValue={product?.team_id ?? ""}
          required
          className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
        >
          <option value="">Selecione um time</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Temporada" name="season" defaultValue={product?.season ?? ""} placeholder="2026" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted">Categoria</label>
          <select
            name="category"
            defaultValue={product?.category ?? "casa"}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
          >
            <option value="casa">Casa</option>
            <option value="fora">Fora</option>
            <option value="alternativa">Alternativa</option>
            <option value="retro">Retrô</option>
            <option value="selecao">Seleção</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-muted">Descrição comercial</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          placeholder="Descreva o produto de forma transparente (ex: modelo torcedor, tecido, etc). Nunca afirme originalidade/licenciamento sem comprovação."
          className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)" name="price" type="number" defaultValue={String(product?.price ?? 149.9)} required />
        <Field label="Preço 'de' (opcional)" name="compare_at_price" type="number" defaultValue={product?.compare_at_price ? String(product.compare_at_price) : ""} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">Tamanhos disponíveis</p>
        <div className="flex flex-wrap gap-3">
          {ALL_SIZES.map((size) => (
            <label key={size} className="flex items-center gap-1.5 text-sm text-ink">
              <input type="checkbox" name={`size_${size}`} defaultChecked={selectedSizes.has(size)} className="h-4 w-4 rounded border-base-border accent-accent" />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div className="card-surface space-y-4 p-5">
        <p className="text-sm font-semibold">Personalização</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="allow_custom_name" checked={allowName} onChange={(e) => setAllowName(e.target.checked)} className="h-4 w-4 rounded border-base-border accent-accent" />
            Permitir nome
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="allow_custom_number" checked={allowNumber} onChange={(e) => setAllowNumber(e.target.checked)} className="h-4 w-4 rounded border-base-border accent-accent" />
            Permitir número
          </label>
        </div>
        {allowName && <Field label="Máx. de caracteres do nome" name="max_name_characters" type="number" defaultValue={String(product?.max_name_characters ?? 12)} />}
        {allowNumber && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Número mínimo" name="min_number" type="number" defaultValue={String(product?.min_number ?? 1)} />
            <Field label="Número máximo" name="max_number" type="number" defaultValue={String(product?.max_number ?? 99)} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Checkbox label="Ativo" name="is_active" defaultChecked={product?.is_active ?? true} />
        <Checkbox label="Destaque" name="is_featured" defaultChecked={product?.is_featured ?? false} />
        <Checkbox label="Mais vendido" name="is_best_seller" defaultChecked={product?.is_best_seller ?? false} />
        <Checkbox label="Lançamento" name="is_new" defaultChecked={product?.is_new ?? false} />
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
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-muted">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
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
      {pending ? "Salvando..." : "Salvar produto"}
    </button>
  );
}
