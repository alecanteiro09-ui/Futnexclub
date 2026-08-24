import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

/**
 * Cabeçalho principal. A logo virá de `settings.logo_url` (admin);
 * enquanto não houver logo cadastrada, mostramos o texto da marca (seção 55).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink">
          FUTNEX <span className="text-accent">CLUB</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted lg:flex">
          <Link href="/catalogo" className="transition-colors hover:text-ink">Catálogo</Link>
          <Link href="/times" className="transition-colors hover:text-ink">Times</Link>
          <Link href="/mais-vendidas" className="transition-colors hover:text-ink">Mais Vendidas</Link>
          <Link href="/lancamentos" className="transition-colors hover:text-ink">Lançamentos</Link>
          <Link href="/colecoes/retro" className="transition-colors hover:text-ink">Retrô</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/busca"
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-border text-ink transition-colors hover:bg-base-soft"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/pedido"
            aria-label="Meu pedido"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-border text-ink transition-colors hover:bg-base-soft"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
