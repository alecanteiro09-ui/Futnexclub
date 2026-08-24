"use client";

import { ProductSize, SizeLabel } from "@/types";
import { cn } from "@/lib/utils";

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: ProductSize[];
  selected: SizeLabel | null;
  onSelect: (size: SizeLabel) => void;
}) {
  const available = sizes.filter((s) => s.is_available);

  if (available.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-muted">Tamanho</p>
      <div className="flex flex-wrap gap-2">
        {available.map((s) => (
          <button
            key={s.size}
            type="button"
            onClick={() => onSelect(s.size)}
            className={cn(
              "flex h-12 w-14 items-center justify-center rounded-xl border text-sm font-bold transition-colors",
              selected === s.size
                ? "border-accent bg-accent text-white"
                : "border-base-border text-ink hover:border-accent/50"
            )}
          >
            {s.size}
          </button>
        ))}
      </div>
    </div>
  );
}
