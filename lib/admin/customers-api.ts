import { adminApi } from "./api";
import type { Customer, Order, PaginatedResult } from "./types";

export interface CustomersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

/**
 * TODO: Requires backend endpoint. "Customers" wasn't among the example
 * routes given (app/api/orders, app/api/menu/*) — confirm whether this is
 * /api/customers, /api/users, or something derived from Orders + Users.
 * Using /api/customers as the default guess.
 */
export function fetchCustomers(query: CustomersQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return adminApi.get<PaginatedResult<Customer>>(`/api/customers${qs ? `?${qs}` : ""}`);
}

/** TODO: Requires backend endpoint — confirm GET /api/customers/[id]/orders. */
export function fetchCustomerOrders(customerId: string) {
  return adminApi.get<Order[]>(`/api/customers/${customerId}/orders`);
}
