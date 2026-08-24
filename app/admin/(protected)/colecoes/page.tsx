import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Collection } from "@/types";

async function getAllCollections(): Promise<Collection[]> {
  const supabase = createClient();
  const { data } = await supabase.from("collections").select("*").order("sort_order");
  return (data ?? []) as Collection[];
}

export default async function AdminColecoesPage() {
  const collections = await getAllCollections();

  return (
    <div>
      <h1 className="h2-display mb-2">Coleções</h1>
      <p className="mb-8 text-sm text-ink-muted">
        Para associar produtos a uma coleção, edite o produto em{" "}
        <Link href="/admin/produtos" className="text-accent hover:underline">/admin/produtos</Link> (associação por coleção chega na próxima iteração do formulário).
      </p>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-border text-ink-muted">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-b border-base-border last:border-0">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-ink-muted">/{c.slug}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${c.is_active ? "bg-success/15 text-success" : "bg-ink-muted/15 text-ink-muted"}`}>
                    {c.is_active ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
