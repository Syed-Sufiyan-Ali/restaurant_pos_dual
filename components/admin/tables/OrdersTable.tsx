"use client";

import { Eye } from "lucide-react";
import type { Order } from "@/lib/admin/types";
import { GuestBadge, OrderStatusBadge } from "@/components/admin/common/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/admin/utils";

interface OrdersTableProps {
  orders: Order[];
  onSelect: (id: string) => void;
}

export function OrdersTable({ orders, onSelect }: OrdersTableProps) {
  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wide text-[var(--admin-text-faint)]">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Placed</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {orders.map((order) => {
            const isGuest = !order.user;
            const customerName = order.user?.name ?? order.guestName ?? "—";
            const phone = order.user?.phone ?? order.guestPhone ?? "—";
            return (
              <tr key={order.id} className="cursor-pointer hover:bg-[var(--admin-surface-hover)]" onClick={() => onSelect(order.id)}>
                <td className="px-4 py-3 font-[family-name:var(--font-admin-mono)] text-xs text-[var(--admin-text)]">
                  #{order.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--admin-text)]">{customerName}</span>
                    <GuestBadge isGuest={isGuest} />
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--admin-text-muted)]">{phone}</td>
                <td className="px-4 py-3 font-medium text-[var(--admin-text)]">{formatCurrency(order.totalAmount)}</td>
                <td className="px-4 py-3 text-[var(--admin-text-muted)]">{order.paymentMethod}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-[var(--admin-text-muted)]">{formatDateTime(order.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(order.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--admin-border)] px-2.5 py-1.5 text-xs text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)]"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-[var(--admin-border)] md:hidden">
        {orders.map((order) => {
          const isGuest = !order.user;
          const customerName = order.user?.name ?? order.guestName ?? "—";
          return (
            <button
              key={order.id}
              type="button"
              onClick={() => onSelect(order.id)}
              className="flex w-full flex-col gap-2 px-4 py-3 text-left hover:bg-[var(--admin-surface-hover)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-admin-mono)] text-xs text-[var(--admin-text-faint)]">
                  #{order.orderNumber}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-text)]">{customerName}</span>
                <GuestBadge isGuest={isGuest} />
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
                <span>{formatDateTime(order.createdAt)}</span>
                <span className="font-medium text-[var(--admin-text)]">{formatCurrency(order.totalAmount)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
