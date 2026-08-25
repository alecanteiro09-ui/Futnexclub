"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, SizeLabel, KitItemDraft } from "@/types";
import { Personalization } from "@/components/product/Personalization";
import { SizeSelector } from "@/components/product/SizeSelector";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { useCart } from "@/components/cart/CartProvider";
import { formatBRL } from "@/lib/pricing";
import { isValidCustomNumber } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, isFull } = useCart();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [size, setSize] = useState<SizeLabel | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
  const hasDiscount = Boolean(product.compare_at_price && product.compare_at_price > product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0;
  const numberValid = isValidCustomNumber(number, product.min_number, product.max_number);
  const nameOk = !product.allow_custom_name || name.trim().length > 0;
  const numberOk = !product.allow_custom_number || (number !== "" && numberValid);
  const canAdd = Boolean(size) && nameOk && numberOk && !isFull;

  function buildCurrentItem(): KitItemDraft {
    return {
      id: crypto.randomUUID(),
      team: product.team
        ? { id: product.team.id, name: product.team.name, slug: product.team.slug, logo_url: product.team.logo_url }
        : null,
      product: { id: product.id, name: product.name, slug: product.slug, price: product.price },
      imageUrl: primaryImage?.image_url ?? null,
      customName: name,
      customNumber: number,
      size,
    };
  }

  function handleAddToKit() {
    if (!canAdd) return;

    addItem(buildCurrentItem());

    setFeedback("Camisa adicionada ao seu kit!");
    setTimeout(() => setFeedback(null), 2500);

    if (items.length + 1 < 3) {
      // Deixa o cliente decidir se quer continuar montando o kit
    } else {
      router.push("/pedido");
    }
  }

  return (
    <div className="space-y-6 pb-28 lg:pb-0">
      <div>
        {product.team && (
          <p className="text-sm font-semibold text-accent">{product.team.name}</p>
        )}
        <h1 className="font-display text-2xl font-bold text-ink lg:text-3xl">{product.name}</h1>
        {product.season && <p className="mt-1 text-sm text-ink-muted">Temporada {product.season}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="font-display text-3xl font-extrabold text-ink">{formatBRL(product.price)}</p>
          {hasDiscount && (
            <>
              <span className="text-base font-medium text-ink-muted line-through">
                {formatBRL(product.compare_at_price!)}
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
        {product.description && <p className="mt-4 text-sm text-ink-muted">{product.description}</p>}
      </div>

      <Personalization
        allowName={product.allow_custom_name}
        allowNumber={product.allow_custom_number}
        maxNameChars={product.max_name_characters}
        minNumber={product.min_number}
        maxNumber={product.max_number}
        name={name}
        number={number}
        onNameChange={setName}
        onNumberChange={setNumber}
      />

      {product.sizes && <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />}

      {items.length > 0 && (
        <p className="text-sm text-ink-muted">
          Seu kit: {items.length}/3 camisa{items.length > 1 ? "s" : ""} escolhida{items.length > 1 ? "s" : ""}.{" "}
          <a href="/pedido" className="font-semibold text-accent hover:underline">Ver resumo</a>
        </p>
      )}

      {feedback && <p className="text-sm font-semibold text-success">{feedback}</p>}

      {/* Desktop: ações inline */}
      <div className="hidden gap-3 lg:flex">
        <button type="button" onClick={handleAddToKit} disabled={!canAdd} className="btn-secondary">
          Adicionar ao kit
        </button>
        <WhatsAppButton
          items={canAdd ? [...items, buildCurrentItem()] : items}
          label="Pedir pelo WhatsApp"
          disabled={!canAdd}
        />
      </div>
      {!canAdd && (
        <p className="hidden text-xs text-ink-muted lg:block">
          Escolha tamanho{product.allow_custom_name ? ", nome" : ""}{product.allow_custom_number ? " e número" : ""} para continuar.
        </p>
      )}

      {/* Mobile: CTA fixo */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-base-border bg-base p-4 lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-bold">{formatBRL(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-xs font-medium text-ink-muted line-through">
                  {formatBRL(product.compare_at_price!)}
                </span>
                <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
          {!canAdd && <span className="text-xs text-ink-muted">Escolha tamanho{product.allow_custom_name ? ", nome" : ""}{product.allow_custom_number ? " e número" : ""}</span>}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleAddToKit} disabled={!canAdd} className="btn-secondary flex-1">
            Adicionar ao kit
          </button>
        </div>
      </div>
    </div>
  );
}
