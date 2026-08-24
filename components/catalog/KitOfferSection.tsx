import Link from "next/link";
import { Check } from "lucide-react";
import { KIT_BENEFITS, KitSize, formatBRL } from "@/lib/pricing";
import { getKitPricingFromSettings } from "@/lib/pricing-server";
import { cn } from "@/lib/utils";

export async function KitOfferSection() {
  const prices = await getKitPricingFromSettings();

  const kits: { quantity: KitSize; label: string; featured: boolean }[] = [
    { quantity: 1, label: "1 camisa", featured: false },
    { quantity: 2, label: "2 camisas", featured: true },
    { quantity: 3, label: "3 camisas", featured: false },
  ];

  return (
    <section className="container-app py-16 lg:py-24">
      <div className="mb-10 text-center">
        <h2 className="h2-display">Escolha seu kit</h2>
        <p className="mt-3 text-ink-muted">Monte seu pedido com 1, 2 ou 3 camisas personalizadas.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {kits.map((kit) => (
          <div
            key={kit.quantity}
            className={cn(
              "card-surface relative flex flex-col gap-5 p-8",
              kit.featured && "border-accent/50 ring-1 ring-accent/30"
            )}
          >
            {kit.featured && (
              <span className="badge absolute -top-3 left-6">⭐ Mais vendida</span>
            )}

            <div>
              <p className="text-sm font-medium text-ink-muted">{kit.label}</p>
              <p className="font-display text-3xl font-extrabold text-ink">{formatBRL(prices[kit.quantity])}</p>
            </div>

            <ul className="space-y-2">
              {KIT_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-ink-muted">
                  <Check className="h-4 w-4 text-success" />
                  {benefit}
                </li>
              ))}
            </ul>

            <Link
              href={`/catalogo?kit=${kit.quantity}`}
              className={cn("mt-auto", kit.featured ? "btn-primary" : "btn-secondary")}
            >
              Escolher camisas
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
