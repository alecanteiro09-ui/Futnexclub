"use client";

import { sanitizeCustomName, isValidCustomNumber } from "@/lib/utils";

interface PersonalizationProps {
  allowName: boolean;
  allowNumber: boolean;
  maxNameChars: number;
  minNumber: number;
  maxNumber: number;
  name: string;
  number: string;
  onNameChange: (value: string) => void;
  onNumberChange: (value: string) => void;
}

/**
 * Formulário de personalização (seção 32) + preview visual em CSS (seção 33).
 * Arquitetura já preparada para, futuramente, permitir configurar posição/fonte/cor
 * por produto — hoje o overlay usa um posicionamento padrão fixo.
 */
export function Personalization({
  allowName,
  allowNumber,
  maxNameChars,
  minNumber,
  maxNumber,
  name,
  number,
  onNameChange,
  onNumberChange,
}: PersonalizationProps) {
  if (!allowName && !allowNumber) return null;

  const numberError = number !== "" && !isValidCustomNumber(number, minNumber, maxNumber);

  return (
    <div className="card-surface space-y-5 p-6">
      <h3 className="font-display text-lg font-bold">Personalize sua camisa</h3>

      {/* Preview visual — overlay CSS sobre a área do produto, sem editar a imagem */}
      <div className="relative flex aspect-[4/5] max-h-64 items-center justify-center overflow-hidden rounded-xl border border-base-border bg-base">
        <div className="pointer-events-none flex flex-col items-center gap-1 text-ink">
          <span className="font-display text-xl font-extrabold uppercase tracking-wide">
            {name ? sanitizeCustomName(name, maxNameChars) : allowName ? "SEU NOME" : ""}
          </span>
          <span className="font-display text-4xl font-black">
            {number || (allowNumber ? "00" : "")}
          </span>
        </div>
      </div>

      {allowName && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted" htmlFor="custom-name">
            Nome
          </label>
          <input
            id="custom-name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            maxLength={maxNameChars}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
          />
          <p className="mt-1 text-right text-xs text-ink-muted">
            {name.length}/{maxNameChars}
          </p>
        </div>
      )}

      {allowNumber && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted" htmlFor="custom-number">
            Número
          </label>
          <input
            id="custom-number"
            type="number"
            placeholder="10"
            min={minNumber}
            max={maxNumber}
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
          />
          {numberError && (
            <p className="mt-1 text-xs text-red-400">
              Escolha um número entre {minNumber} e {maxNumber}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
