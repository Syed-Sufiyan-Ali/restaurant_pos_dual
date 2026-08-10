"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import { PageHeader } from "@/components/admin/common/PageHeader";
import { SearchInput } from "@/components/admin/common/SearchInput";
import { Pagination } from "@/components/admin/common/Pagination";
import { LoadingScreen } from "@/components/admin/common/LoadingScreen";
import { ErrorState } from "@/components/admin/common/ErrorState";
import { EmptyState } from "@/components/admin/common/EmptyState";
import { ToasterProvider } from "@/components/admin/ui/Toaster";
import {StatusBadge} from "@/components/admin/common/StatusBadge";
import { OrdersTable } from "@/components/admin/tables/OrdersTable";
import { OrderStatusFilter } from "@/components/admin/orders/OrderStatusFilter";
import { OrderDetailDrawer } from "@/components/admin/orders/OrderDetailDrawer";

import { fetchOrders } from "@/lib/admin/orders-api";
import type { Order, PaginatedResult } from "@/lib/admin/types";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  return (
    <ToasterProvider>
      <OrdersPageInner />
    </ToasterProvider>
  );
}

function OrdersPageInner() {
  // ─── List state ────────────────────────────────────────────────────────────
  const [result, setResult] = useState<PaginatedResult<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Detail drawer ─────────────────────────────────────────────────────────
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchOrders({
      page,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      status: statusFilter || undefined,
    });
    console.log("Orders API response:", res);
    setLoading(false);

    if (res.success) {
  console.log("res.data =", res.data);
  setResult(res.data);
} else {
  console.log(res);
  setError(res.message);
}
  
  }, [page, search, statusFilter]);

  // Debounce search, reset page on filter changes
  useEffect(() => {
   if (searchTimeout.current) {
  clearTimeout(searchTimeout.current);
}
    searchTimeout.current = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <PageHeader
          title="Orders"
          description="View and manage customer orders."
        />

        {/* Filters bar */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <div className="flex flex-col gap-3">
            <OrderStatusFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
            />
            <div className="flex items-center gap-3">
              <SearchInput
                value={search}
                onChange={(v) => setSearch(v)}
                placeholder="Search by order number or customer…"
                className="max-w-xs"
              />
              {result && (
                <p className="text-xs text-[var(--admin-text-muted)]">
                  {result.total} order{result.total !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
          {loading ? (
            <LoadingScreen />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !result || result.items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title={
                search || statusFilter
                  ? "No orders match your filters"
                  : "No orders yet"
              }
              description={
                search || statusFilter
                  ? "Try adjusting your search or filter."
                  : "Orders will appear here once customers start placing them."
              }
            />
          ) : (
            <>
              <OrdersTable
    orders={result.items}
    onSelect={setSelectedOrderId}
/>
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Detail drawer — rendered outside the motion div so it sits above everything */}
      <OrderDetailDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdated={load}
      />
    </>
  );
}
