"use client";

import { useState } from "react";
import { useAdminAuth, useAdminTheme, useSidebarCollapsed } from "@/lib/admin/hooks";
import { AdminNavbar } from "../navbar/AdminNavbar";
import { AdminSidebar } from "../sidebar/AdminSidebar";
import { LoadingScreen } from "./LoadingScreen";

interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * The one place that composes the protected admin layout: auth guard,
 * collapsible sidebar, top navbar, and the routed page content.
 */
export function AdminShell({ children }: AdminShellProps) {
  const { user, isLoading, isAuthenticated, logout } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);

if (isLoading) return <LoadingScreen />;

if (!isAuthenticated) return null;

const allowedRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"];

if (!user || !allowedRoles.includes(user.role)) {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
  return null;
}

  return (
    <div
      className={`admin-root ${theme === "light" ? "theme-light" : ""} flex min-h-screen bg-[var(--admin-bg)] font-[family-name:var(--font-admin-body)] text-[var(--admin-text)]`}
    >
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        role={user?.role}
        onLogout={logout}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminNavbar user={user} onOpenMobileMenu={() => setMobileOpen(true)} onLogout={logout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
