import { adminApi } from "./api";
import type { PaginatedResult, Reservation } from "./types";

export interface ReservationsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  date?: string;
}

/**
 * TODO: Requires backend endpoint. Confirm the real path (assumed
 * /api/reservations) and query param names against the existing route.
 */
export function fetchReservations(query: ReservationsQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const qs = params.toString();
  return adminApi.get<PaginatedResult<Reservation>>(`/api/reservations${qs ? `?${qs}` : ""}`);
}

/**
 * TODO: Requires backend endpoint — confirm PATCH /api/reservations/[id]
 * accepts { status: "ACCEPTED" | "REJECTED" | "COMPLETED" }.
 */
export function updateReservationStatus(id: string, status: string) {
  return adminApi.patch<Reservation>(`/api/reservations/${id}`, { status });
}
