"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { KIT_BENEFITS, KIT_PRICING, formatBRL, KitSize, getKitPricingFromSettingsClient } from "@/lib/pricing";
import { ProductImagePlaceholder } from "@/components/ui/Placeholders";

export default function PedidoPage() {
  const { items, removeItem, clear } = useCart();
  const [prices, setPrices] = useState<Record<KitSize, number>>(KIT_PRICING);

  useEffect(() => {
    getKitPricingFromSettingsClient().then(setPrices);
  }, []);

  const quantity = items.length as KitSize;
  const total = quantity >= 1 && quantity <= 3 ? prices[quantity] : 0;

  return (
    <div className="container-app py-12 pb-32">
      <h1 className="h1-display text-3xl lg:text-4xl">Seu pedido</h1>

      {items.length === 0 ? (
        <div className="card-surface mt-8 flex flex-col items-center gap-3 p-12 text-center">
          <p className="font-display text-lg font-bold">Seu kit ainda está vazio.</p>
          <p className="text-sm text-ink-muted">Escolha um time e monte sua camisa personalizada.</p>
          <Link href="/catalogo" className="btn-primary mt-2">Explorar camisas</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="card-surface flex gap-4 p-4">
                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-base">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.product?.name ?? ""} fill className="object-contain" />
                  ) : (
                    <ProductImagePlaceholder className="h-full rounded-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Camisa {index + 1}
                  </p>
                  <p className="font-semibold text-ink">{item.product?.name}</p>
                  <p className="text-sm text-ink-muted">{item.team?.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {item.customName || "Sem nome"} · {item.customNumber || "S/N"} · {item.size ?? "-"}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remover camisa"
                  className="h-fit text-ink-muted transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            {items.length < 3 && (
              <Link
                href="/catalogo"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-base-border p-4 text-sm font-semibold text-ink-muted transition-colors hover:border-accent/50 hover:text-ink"
              >
                <Plus className="h-4 w-4" /> Adicionar outra camisa
              </Link>
            )}
          </div>

          <div className="card-surface h-fit space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Resumo</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">
                {quantity} camisa{quantity > 1 ? "s" : ""}
              </span>
              <span className="font-display text-xl font-extrabold">{formatBRL(total)}</span>
            </div>
            <ul className="space-y-1 text-sm text-ink-muted">
              {KIT_BENEFITS.map((b) => (
                <li key={b}>✓ {b}</li>
              ))}
            </ul>
            <WhatsAppButton items={items} label="Finalizar no WhatsApp" fullWidth />
            <button onClick={clear} className="w-full text-center text-xs text-ink-muted hover:text-ink">
              Esvaziar kit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
