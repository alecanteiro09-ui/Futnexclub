import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatBRL } from "@/lib/pricing";
import { ProductImagePlaceholder } from "@/components/ui/Placeholders";

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-base-border bg-base-soft transition-colors hover:border-accent/40"
    >
      <div className="relative">
        {primaryImage ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-base">
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <ProductImagePlaceholder className="rounded-none" />
        )}

        {(product.is_best_seller || product.is_new) && (
          <span className="badge absolute left-3 top-3">
            {product.is_best_seller ? "Mais vendida" : "Lançamento"}
          </span>
        )}
      </div>

      <div className="space-y-1 p-4">
        <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
        <p className="font-display text-lg font-bold text-ink">{formatBRL(product.price)}</p>
      </div>
    </Link>
  );
}
