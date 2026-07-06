// Store do carrinho (zustand + persist no localStorage).
// Fase atual: itens, quantidade, remover, subtotal, contagem.
// Ainda sem checkout real (Mercado Pago), Supabase ou webhook.
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { sku: string; name: string; price: number; qty: number };

const MAX_QTY = 99;

type CartState = {
  items: CartItem[];
  count: () => number;
  subtotal: () => number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.sku === item.sku);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.sku === item.sku ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: Math.min(MAX_QTY, qty) }] };
        }),
      updateQty: (sku, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.sku !== sku) };
          }
          return {
            items: state.items.map((i) =>
              i.sku === sku ? { ...i, qty: Math.min(MAX_QTY, qty) } : i
            ),
          };
        }),
      removeItem: (sku) =>
        set((state) => ({ items: state.items.filter((i) => i.sku !== sku) })),
      clear: () => set({ items: [] }),
    }),
    { name: "overberry-cart" }
  )
);
