import Link from "next/link";
import { ShieldCheck, Truck, Headphones, CreditCard, Clock } from "lucide-react";
import { DELIVERY_TIME_LABEL_DEFAULT } from "@/lib/pricing";

const trustItems = [
  { icon: ShieldCheck, label: "Personalização incluída" },
  { icon: Truck, label: "Frete grátis" },
  { icon: Headphones, label: "Atendimento humano" },
  { icon: CreditCard, label: "Pagamento por Pix ou cartão" },
  { icon: Clock, label: `Prazo: ${DELIVERY_TIME_LABEL_DEFAULT}` },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-base-border">
      <div className="container-app py-14">
        <h3 className="h2-display mb-8">Compre com tranquilidade</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-start gap-3">
              <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
              <span className="text-sm text-ink-muted">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-base-border pt-8 sm:flex-row sm:items-center">
          <p className="font-display text-lg font-bold">
            FUTNEX <span className="text-accent">CLUB</span>
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link href="/catalogo" className="hover:text-ink">Catálogo</Link>
            <Link href="/times" className="hover:text-ink">Times</Link>
            <Link href="/colecoes/mais-vendidas" className="hover:text-ink">Mais Vendidas</Link>
            <Link href="/pedido" className="hover:text-ink">Meu Pedido</Link>
          </nav>
          <p className="text-xs text-ink-muted">
            Produtos modelo torcedor. Marca não afiliada a clubes ou confederações,
            salvo quando expressamente indicado no produto.
          </p>
        </div>
      </div>
    </footer>
  );
}
