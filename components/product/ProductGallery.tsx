"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { ProductImagePlaceholder } from "@/components/ui/Placeholders";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(sorted.findIndex((img) => img.is_primary), 0)
  );

  if (sorted.length === 0) {
    return <ProductImagePlaceholder />;
  }

  const active = sorted[activeIndex];

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-base-border bg-base-soft">
        <Image
          src={active.image_url}
          alt={active.alt_text ?? productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {sorted.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-base-soft transition-colors",
                i === activeIndex ? "border-accent" : "border-base-border"
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image src={img.image_url} alt={img.alt_text ?? productName} fill className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
