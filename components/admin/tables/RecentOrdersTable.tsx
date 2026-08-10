"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { ErrorState } from "@/components/admin/common/ErrorState";
import { OrderStatusBadge } from "@/components/admin/common/StatusBadge";
import type { LoadState, Order } from "@/lib/admin/types";
import { formatCurrency, formatDateTime } from "@/lib/admin/utils";

interface RecentOrdersTableProps {
  state: LoadState<Order[]>;
}

export function RecentOrdersTable({ state }: RecentOrdersTableProps) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
        <h2 className="font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
          Recent orders
        </h2>
        <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-[var(--admin-ember)] hover:underline">
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--admin-surface-2)]" />
          ))}
        </div>
      )}
      {state.status === "error" && (
        <div className="p-5">
          <ErrorState compact message={state.message} />
        </div>
      )}
      {state.status === "success" && state.data.length === 0 && (
        <div className="p-5">
          <EmptyState compact title="No orders yet" description="New orders will show up here as they come in." />
        </div>
      )}
      {state.status === "success" && state.data.length > 0 && (
        <ul className="divide-y divide-[var(--admin-border)]">
          {state.data.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-admin-mono)] text-xs text-[var(--admin-text-faint)]">#{order.orderNumber}</p>
                <p className="truncate text-[var(--admin-text)]">{order.user?.name ?? order.guestName ?? "Guest"}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-medium text-[var(--admin-text)]">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs text-[var(--admin-text-faint)]">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="shrink-0">
                <OrderStatusBadge status={order.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
