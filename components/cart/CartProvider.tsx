"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { KitItemDraft } from "@/types";

const STORAGE_KEY = "futnex_kit_v1";
const MAX_ITEMS = 3;

interface CartContextValue {
  items: KitItemDraft[];
  addItem: (item: KitItemDraft) => void;
  updateItem: (id: string, patch: Partial<KitItemDraft>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isFull: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KitItemDraft[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // hidrata do localStorage no client (evita mismatch de SSR)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignora storage corrompido
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: KitItemDraft) {
    setItems((prev) => (prev.length >= MAX_ITEMS ? prev : [...prev, item]));
  }

  function updateItem(id: string, patch: Partial<KitItemDraft>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clear, isFull: items.length >= MAX_ITEMS }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
