"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/lib/admin/types";

interface Transition {
  to: OrderStatus;
  label: string;
  style: string;
}

// Maps current status → available next transitions (business logic)
const TRANSITIONS: Partial<Record<string, Transition[]>> = {
  PENDING: [
    {
      to: "CONFIRMED",
      label: "Confirm Order",
      style: "bg-blue-500 text-white hover:bg-blue-600",
    },
    {
      to: "CANCELLED",
      label: "Cancel Order",
      style:
        "border border-red-400/40 bg-red-500/10 text-red-500 hover:bg-red-500/20",
    },
  ],

  CONFIRMED: [
    {
      to: "PREPARING",
      label: "Start Preparing",
      style: "bg-violet-500 text-white hover:bg-violet-600",
    },
    {
      to: "CANCELLED",
      label: "Cancel Order",
      style:
        "border border-red-400/40 bg-red-500/10 text-red-500 hover:bg-red-500/20",
    },
  ],

  PREPARING: [
    {
      to: "ON_THE_WAY",
      label: "Out for Delivery",
      style: "bg-orange-500 text-white hover:bg-orange-600",
    },
  ],

  ON_THE_WAY: [
    {
      to: "DELIVERED",
      label: "Mark Delivered",
      style: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
  ],
};

interface OrderStatusButtonsProps {
  currentStatus: OrderStatus | string;
  onUpdate: (status: OrderStatus) => Promise<void>;
}

export function OrderStatusButtons({ currentStatus, onUpdate }: OrderStatusButtonsProps) {
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const transitions = TRANSITIONS[currentStatus] ?? [];

  if (transitions.length === 0) {
    return (
      <p className="text-xs text-[var(--admin-text-muted)]">
        No further status updates available.
      </p>
    );
  }

  async function handle(to: OrderStatus) {
    setUpdating(to);
    await onUpdate(to);
    setUpdating(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t) => (
        <button
          key={t.to}
          onClick={() => handle(t.to)}
          disabled={updating !== null}
          className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${t.style}`}
        >
          {updating === t.to && <Loader2 size={12} className="animate-spin" />}
          {t.label}
        </button>
      ))}
    </div>
  );
}
