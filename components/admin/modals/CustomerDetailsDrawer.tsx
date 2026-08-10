"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/admin/common/Drawer";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { OrderStatusBadge } from "@/components/admin/common/StatusBadge";
import { fetchCustomerOrders } from "@/lib/admin/customers-api";
import type { Customer, Order } from "@/lib/admin/types";
import { formatCurrency, formatDateTime } from "@/lib/admin/utils";
import { useToast } from "@/lib/admin/toast";

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDetailsDrawer({ customer, onClose }: CustomerDetailsDrawerProps) {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error" | "success">("idle");

  useEffect(() => {
    if (!customer) {
      setOrders([]);
      setLoadState("idle");
      return;
    }
    setLoadState("loading");
    fetchCustomerOrders(customer.id).then((res) => {
      if (res.success) {
        setOrders(res.data);
        setLoadState("success");
      } else {
        setLoadState("error");
        showToast(res.message, "error");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  return (
    <Drawer
      open={!!customer}
      onClose={onClose}
      title={customer?.name ?? "Customer"}
      description={customer?.email ?? customer?.phone ?? undefined}
    >
      {customer && (
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--admin-border)] p-3">
              <p className="text-xs text-[var(--admin-text-faint)]">Total orders</p>
              <p className="mt-1 text-lg font-semibold text-[var(--admin-text)]">{customer.totalOrders}</p>
            </div>
            <div className="rounded-xl border border-[var(--admin-border)] p-3">
              <p className="text-xs text-[var(--admin-text-faint)]">Total spent</p>
              <p className="mt-1 text-lg font-semibold text-[var(--admin-text)]">{formatCurrency(customer.totalSpent)}</p>
            </div>
          </div>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Order history</h3>

            {loadState === "loading" && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--admin-surface-2)]" />
                ))}
              </div>
            )}
            {loadState === "error" && <p className="text-[var(--admin-text-muted)]">Couldn&apos;t load order history.</p>}
            {loadState === "success" && orders.length === 0 && (
              <EmptyState compact title="No orders yet" description="This customer hasn't ordered yet." />
            )}
            {loadState === "success" && orders.length > 0 && (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] px-3 py-2">
                    <div>
                      <p className="font-[family-name:var(--font-admin-mono)] text-xs text-[var(--admin-text-faint)]">#{order.orderNumber}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--admin-text)]">{formatCurrency(order.totalAmount)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Drawer>
  );
}
