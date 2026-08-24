import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";
import { Team } from "@/types";

export default async function NovoProdutoPage() {
  const supabase = createClient();
  const { data: teams } = await supabase.from("teams").select("*").eq("is_active", true).order("name");

  return (
    <div>
      <h1 className="h2-display mb-8">Novo produto</h1>
      <ProductForm teams={(teams ?? []) as Team[]} action={createProduct} />
    </div>
  );
}
