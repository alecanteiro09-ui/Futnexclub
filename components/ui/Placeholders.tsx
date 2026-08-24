import { Shirt, Shield, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Usado sempre que um produto ainda não tem imagem cadastrada (seção 57 do briefing) */
export function ProductImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-base-border bg-base-soft",
        className
      )}
    >
      <Shirt className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
    </div>
  );
}

export function TeamLogoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border border-base-border bg-base-soft",
        className
      )}
    >
      <Shield className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
    </div>
  );
}

export function CollectionImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-base-border bg-base-soft",
        className
      )}
    >
      <ImageIcon className="h-8 w-8 text-ink-muted" strokeWidth={1.5} />
    </div>
  );
}
