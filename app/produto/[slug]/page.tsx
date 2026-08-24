import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.name}${product.team ? ` | Futnex Club` : ""}`;
  return {
    title,
    description: product.description ?? `${product.name} personalizada com nome e número na Futnex Club.`,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title,
      description: product.description ?? undefined,
      images: product.images?.[0]?.image_url ? [product.images[0].image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="container-app py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} productName={product.name} />
        <ProductPurchasePanel product={product} />
      </div>
    </div>
  );
}
