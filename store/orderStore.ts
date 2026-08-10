"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus } from "@/types";

interface OrderStore {
  currentOrder: Order | null;
  orderHistory: Order[];
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => string;
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],
      placeOrder: (orderData) => {
        const id = "PT" + Date.now().toString().slice(-6);
        const order: Order = { ...orderData, id, status: "confirmed", createdAt: new Date().toISOString() };
        set((s) => ({ currentOrder: order, orderHistory: [order, ...s.orderHistory] }));
        setTimeout(() => set((s) => ({ currentOrder: s.currentOrder?.id === id ? { ...s.currentOrder, status: "preparing" } : s.currentOrder, orderHistory: s.orderHistory.map((o) => o.id === id ? { ...o, status: "preparing" } : o) })), 8000);
        setTimeout(() => set((s) => ({ currentOrder: s.currentOrder?.id === id ? { ...s.currentOrder, status: "ontheway" } : s.currentOrder, orderHistory: s.orderHistory.map((o) => o.id === id ? { ...o, status: "ontheway" } : o) })), 20000);
        setTimeout(() => set((s) => ({ currentOrder: s.currentOrder?.id === id ? { ...s.currentOrder, status: "delivered" } : s.currentOrder, orderHistory: s.orderHistory.map((o) => o.id === id ? { ...o, status: "delivered" } : o) })), 40000);
        return id;
      },
      updateStatus: (id, status) => set((s) => ({ currentOrder: s.currentOrder?.id === id ? { ...s.currentOrder, status } : s.currentOrder, orderHistory: s.orderHistory.map((o) => o.id === id ? { ...o, status } : o) })),
      getOrder: (id) => get().orderHistory.find((o) => o.id === id),
    }),
    { name: "pizzatown-orders" }
  )
);
