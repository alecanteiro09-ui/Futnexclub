import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";
import { Product, Team } from "@/types";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: product }, { data: teams }] = await Promise.all([
    supabase.from("products").select("*, images:product_images(*), sizes:product_sizes(size:size_code, is_available)").eq("id", params.id).single(),
    supabase.from("teams").select("*").eq("is_active", true).order("name"),
  ]);

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, params.id);

  return (
    <div>
      <h1 className="h2-display mb-8">Editar {product.name}</h1>
      <ProductForm product={product as unknown as Product} teams={(teams ?? []) as Team[]} action={boundAction} />
    </div>
  );
}
