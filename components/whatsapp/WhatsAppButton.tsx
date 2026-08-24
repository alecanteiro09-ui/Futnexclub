"use client";

import { MessageCircle } from "lucide-react";
import { KitItemDraft } from "@/types";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { getKitPricingFromSettingsClient, KitSize } from "@/lib/pricing";
import { registerOrder } from "@/lib/actions/orders";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  items: KitItemDraft[];
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

/**
 * CTA principal do site (seção 36). Gera a mensagem estruturada e abre o WhatsApp.
 * Não tenta anexar imagem automaticamente — se a plataforma não suportar,
 * apenas abre a conversa com o texto preenchido (seção 37).
 */
export function WhatsAppButton({ items, label = "Pedir pelo WhatsApp", className, fullWidth }: WhatsAppButtonProps) {
  async function handleClick() {
    // Abre a aba ANTES do await — evita bloqueio de pop-up dos navegadores
    const newTab = window.open("", "_blank", "noopener,noreferrer");

    const utm = readStoredUtm();
    const [message, prices] = await Promise.all([
      buildOrderMessage({ items, utm }),
      getKitPricingFromSettingsClient(),
    ]);
    const link = await buildWhatsAppLink(message);

    const quantity = items.length as KitSize;
    if (quantity >= 1 && quantity <= 3) {
      registerOrder({ items, total: prices[quantity], utm }); // não bloqueia a navegação
    }

    // analytics (seção 49) — camada preparada, sem integração obrigatória ainda
    trackEvent("whatsapp_click", { itemCount: items.length });

    if (newTab) {
      newTab.location.href = link;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("btn-whatsapp", fullWidth && "w-full", className)}
    >
      <MessageCircle className="h-5 w-5" />
      {label.toUpperCase()}
    </button>
  );
}

function readStoredUtm() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem("futnex_utm");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function trackEvent(name: string, payload?: Record<string, any>) {
  if (typeof window === "undefined") return;
  // Camada de analytics preparada (seção 49). Plugar GA4/Meta Pixel/TikTok aqui futuramente.
  console.debug(`[analytics] ${name}`, payload);
}
