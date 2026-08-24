import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product, Collection } from "@/types";

interface Props { params: { slug: string } }

async function getCollectionWithProducts(slug: string): Promise<{ collection: Collection; products: Product[] } | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = createClient();
  const { data: collection } = await supabase.from("collections").select("*").eq("slug", slug).eq("is_active", true).single();
  if (!collection) return null;

  const { data: links } = await supabase.from("product_collections").select("product_id").eq("collection_id", collection.id);
  const productIds = (links ?? []).map((l) => l.product_id);
  if (productIds.length === 0) return { collection, products: [] };

  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*), team:teams(*)")
    .in("id", productIds)
    .eq("is_active", true);

  return { collection, products: (products ?? []) as unknown as Product[] };
}

export default async function CollectionPage({ params }: Props) {
  const result = await getCollectionWithProducts(params.slug);
  if (!result) notFound();
  const { collection, products } = result;

  return (
    <div className="container-app py-12">
      <h1 className="h1-display">{collection.name}</h1>
      {collection.description && <p className="mt-3 text-ink-muted">{collection.description}</p>}

      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="card-surface p-12 text-center text-ink-muted">
            Estamos preparando os produtos dessa coleção.
          </div>
        )}
      </div>
    </div>
  );
}
