import { adminApi } from "./api";
import { fetchOrders } from "./orders-api";
import type { DashboardStats, RevenuePoint, TopSellingItem } from "./types";

/**
 * TODO: Requires backend endpoint. No dashboard/analytics route was among
 * the existing route examples given — confirm the real path (this assumes
 * GET /api/dashboard/stats) before wiring this up, or point it at whatever
 * aggregation endpoint already exists.
 */
export function fetchDashboardStats() {
  return adminApi.get<DashboardStats>("/api/admin/dashboard");
}

/** TODO: Requires backend endpoint — confirm path and the `range` param. */
export function fetchRevenueChart(range: "7d" | "30d" = "7d") {
  return adminApi.get<RevenuePoint[]>(`/api/admin/revenue?range=${range}`);
}

/** TODO: Requires backend endpoint. */
export function fetchTopSellingItems(limit = 5) {
  return adminApi.get<TopSellingItem[]>(`/api/admin/top-items?limit=${limit}`);
}

/**
 * Recent orders reuse the existing GET /api/orders list endpoint instead of
 * a dedicated dashboard route — no new API needed for this one.
 */
export function fetchRecentOrders(limit = 6) {
  return fetchOrders({ page: 1, pageSize: limit, sortBy: "createdAt", sortDir: "desc" });
}
