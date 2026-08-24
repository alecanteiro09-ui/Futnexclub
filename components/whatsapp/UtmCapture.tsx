"use client";

import { useEffect } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/**
 * Captura UTM params da URL de entrada e guarda na sessão (seção 50).
 * Renderizado uma vez no layout raiz.
 */
export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) found[key] = value;
    });
    if (Object.keys(found).length > 0) {
      window.sessionStorage.setItem("futnex_utm", JSON.stringify(found));
    }
  }, []);

  return null;
}
