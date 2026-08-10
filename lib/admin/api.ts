import { AUTH_TOKEN_KEY } from "./constants";

// Mirrors the existing backend's response shape exactly:
//   { success: true, data: ... }
//   { success: false, message: "..." }
export type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Clears the stored token and lets the rest of the app know the session is
 * gone (useAdminAuth listens for this and redirects to /login). This keeps
 * "what happens on 401" in one place instead of scattered across pages.
 */
function handleUnauthorized() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("admin-auth-expired"));
}

/**
 * Thin wrapper around fetch() for existing /api route handlers in this same
 * Next.js app. Always calls relative paths (e.g. "/api/orders") — never an
 * external base URL — and always attaches the existing Bearer token.
 */
async function adminFetch<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    return { success: false, message: "Network error. Please check your connection and try again." };
  }

  if (response.status === 401) {
    handleUnauthorized();
    return { success: false, message: "Your session has expired. Please log in again." };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { success: false, message: "Unexpected response from the server." };
  }

  if (json && typeof json === "object" && "success" in json) {
    return json as ApiResponse<T>;
  }

  // Fallback only — every real endpoint is expected to already follow the
  // { success, data | message } shape described above.
  if (response.ok) {
    return { success: true, data: json as T };
  }
  return { success: false, message: "Something went wrong. Please try again." };
}

export const adminApi = {
  get: <T>(path: string, options?: RequestOptions) => adminFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    adminFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    adminFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    adminFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => adminFetch<T>(path, { ...options, method: "DELETE" }),
};

export interface AdminMeResponse {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER";
}

/**
 * TODO (placeholder — confirm with backend, do not assume): the auth guard
 * needs a way to turn a valid Bearer token into the current admin's profile
 * (name, email, role) on page load. We assume this already exists as
 * GET /api/auth/me, validated by the same middleware that injects
 * x-user-id / x-user-role. If the real path or shape differs, update
 * AUTH_ME_ENDPOINT and AdminMeResponse below — nothing else needs to change.
 */
export const AUTH_ME_ENDPOINT = "/api/auth/profile";

export const authApi = {
  me: () => adminApi.get<AdminMeResponse>(AUTH_ME_ENDPOINT),
};
