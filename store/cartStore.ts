"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(
  (i) =>
    i.productId === item.productId &&
    i.size === item.size &&
    JSON.stringify(i.extras) === JSON.stringify(item.extras)
);
        if (existing) {
          set((s) => ({ items: s.items.map((i) => i === existing ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * (i.sizePrice + i.extras.reduce((a, e) => a + e.price, 0)) } : i) }));
        } else {
          set((s) => ({ items: [...s.items, item] }));
        }
        set({ isOpen: true });
      },
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) => set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => i.id === id ? { ...i, quantity: qty, totalPrice: qty * (i.sizePrice + i.extras.reduce((a, e) => a + e.price, 0)) } : i) })),
      clearCart: () => set({ items: [] }),

      setItems: (items) => set({ items }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.totalPrice, 0),
    }),
    { name: "pizzatown-cart" }
  )
);
