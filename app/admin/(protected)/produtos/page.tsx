import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { duplicateProduct, deleteProduct } from "@/lib/actions/products";

async function getAllProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, is_active, is_featured, is_best_seller, is_demo, team:teams(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminProdutosPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="h2-display">Produtos</h1>
        <div className="flex gap-3">
          <Link href="/admin/produtos/importar" className="btn-secondary">
            <Upload className="h-4 w-4" /> Importar
          </Link>
          <Link href="/admin/produtos/novo" className="btn-primary">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-border text-ink-muted">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Time</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tags</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(products as any[]).map((p) => (
              <tr key={p.id} className="border-b border-base-border last:border-0">
                <td className="p-4 font-medium">
                  {p.name} {p.is_demo && <span className="ml-1 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold">demo</span>}
                </td>
                <td className="p-4 text-ink-muted">{p.team?.name ?? "-"}</td>
                <td className="p-4 text-ink-muted">R$ {Number(p.price).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.is_active ? "bg-success/15 text-success" : "bg-ink-muted/15 text-ink-muted"}`}>
                    {p.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4 space-x-1 text-xs text-ink-muted">
                  {p.is_featured && <span>Destaque</span>}
                  {p.is_best_seller && <span>· Mais vendido</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3 text-sm">
                    <Link href={`/admin/produtos/${p.id}/editar`} className="font-semibold text-accent hover:underline">
                      Editar
                    </Link>
                    <form action={duplicateProduct.bind(null, p.id)}>
                      <button type="submit" className="text-ink-muted hover:text-ink">Duplicar</button>
                    </form>
                    {p.is_active && (
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" className="text-ink-muted hover:text-red-400">Desativar</button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-muted">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
