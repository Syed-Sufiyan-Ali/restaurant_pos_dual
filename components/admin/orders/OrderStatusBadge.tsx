"use client";

import type { OrderStatus } from "@/lib/admin/types";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  size?: "sm" | "md";
}

type StatusConfig = {
  label: string;
  dot: string;
  badge: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-500 border-amber-400/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-blue-400",
    badge: "bg-blue-400/10 text-blue-500 border-blue-400/20",
  },
  PREPARING: {
    label: "Preparing",
    dot: "bg-violet-400",
    badge: "bg-violet-400/10 text-violet-500 border-violet-400/20",
  },
 ON_THE_WAY: {
    label: "Out for Delivery",
    dot: "bg-orange-400",
    badge: "bg-orange-400/10 text-orange-500 border-orange-400/20",
  },
  DELIVERED: {
    label: "Delivered",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-500 border-emerald-400/20",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-400/10 text-red-500 border-red-400/20",
  },
};

const FALLBACK: StatusConfig = {
  label: "Unknown",
  dot: "bg-[var(--admin-text-muted)]",
  badge: "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] border-[var(--admin-border)]",
};

export function OrderStatusBadge({ status, size = "md" }: OrderStatusBadgeProps) {
  const cfg = STATUS_MAP[status] ?? { ...FALLBACK, label: status };
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-1.5 w-1.5";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${textSize} ${cfg.badge}`}
    >
      <span className={`flex-shrink-0 rounded-full ${dotSize} ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export { STATUS_MAP };
