"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, type AdminMeResponse } from "./api";
import { AUTH_TOKEN_KEY, LOGIN_ROUTE, SIDEBAR_STORAGE_KEY, THEME_STORAGE_KEY, type AdminRole } from "./constants";
import { decodeJwtPayload, isTokenExpired } from "./utils";

export type AdminUser = AdminMeResponse;

/**
 * Protects everything under app/admin. Reads the existing JWT from
 * localStorage, decodes it optimistically for instant UI, then verifies it
 * against the backend. Redirects to LOGIN_ROUTE if there's no token, the
 * token is expired, or verification fails (including on a 401 from any
 * later API call, via the "admin-auth-expired" event).
 */
export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    router.replace(LOGIN_ROUTE);
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        router.replace(LOGIN_ROUTE);
        setIsLoading(false);
        return;
      }

      const payload = decodeJwtPayload(token);
      if (isTokenExpired(payload)) {
        logout();
        return;
      }

      if (payload?.role) {
        setUser((prev) =>
          prev ?? {
            id: String(payload.userId ?? payload.sub ?? ""),
            name: "",
            email: "",
            role: payload.role as AdminRole,
          }
        );
      }

      const result = await authApi.me();
      if (!isMounted) return;

      if (result.success) {
        setUser(result.data);
        setIsLoading(false);
      } else {
        logout();
      }
    }

    verify();

    function handleExpired() {
      logout();
    }
    window.addEventListener("admin-auth-expired", handleExpired);
    return () => {
      isMounted = false;
      window.removeEventListener("admin-auth-expired", handleExpired);
    };
    // logout/router are stable via useCallback; verify should only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading, isAuthenticated: !isLoading && !!user, logout };
}

export function useAdminTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

export function useSidebarCollapsed(): [boolean, (updater: boolean | ((v: boolean) => boolean)) => void] {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored) setCollapsedState(stored === "true");
  }, []);

  const setCollapsed = useCallback((updater: boolean | ((v: boolean) => boolean)) => {
    setCollapsedState((prev) => {
      const next = typeof updater === "function" ? (updater as (v: boolean) => boolean)(prev) : updater;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return [collapsed, setCollapsed];
}

export function useIsMobile(breakpoint = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(query.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
