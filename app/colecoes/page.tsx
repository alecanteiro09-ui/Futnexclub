import Link from "next/link";
import { getActiveCollections } from "@/lib/data";
import { CollectionImagePlaceholder } from "@/components/ui/Placeholders";

export const metadata = { title: "Coleções" };

export default async function ColecoesIndexPage() {
  const collections = await getActiveCollections();

  return (
    <div className="container-app py-12">
      <h1 className="h1-display">Coleções</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.id} href={`/colecoes/${c.slug}`} className="card-surface overflow-hidden">
            {c.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.cover_image_url} alt={c.name} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <CollectionImagePlaceholder className="rounded-none" />
            )}
            <div className="p-4">
              <p className="font-semibold">{c.name}</p>
            </div>
          </Link>
        ))}
      </div>
      {collections.length === 0 && (
        <div className="card-surface mt-8 p-12 text-center text-ink-muted">
          Nenhuma coleção cadastrada ainda. Conecte o Supabase e rode supabase/seed.sql.
        </div>
      )}
    </div>
  );
}
