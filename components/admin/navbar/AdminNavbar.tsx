"use client";

import { Menu as MenuIcon, Search } from "lucide-react";
import type { AdminUser } from "@/lib/admin/hooks";
import { ThemeToggle } from "../common/ThemeToggle";
import { NavbarBreadcrumb } from "./NavbarBreadcrumb";
import { NavbarNotifications } from "./NavbarNotifications";
import { NavbarProfileMenu } from "./NavbarProfileMenu";

interface AdminNavbarProps {
  user: AdminUser | null;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export function AdminNavbar({ user, onOpenMobileMenu, onLogout }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="rounded-lg p-2 text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <NavbarBreadcrumb />

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 text-sm text-[var(--admin-text-faint)] sm:flex">
          <Search className="h-4 w-4" />
          <span>Search orders, menu items…</span>
          <kbd className="ml-6 rounded border border-[var(--admin-border)] px-1.5 py-0.5 font-[family-name:var(--font-admin-mono)] text-[10px]">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] sm:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <NavbarNotifications />
        <ThemeToggle />
        <div className="mx-1 h-6 w-px bg-[var(--admin-border)]" />
        <NavbarProfileMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
