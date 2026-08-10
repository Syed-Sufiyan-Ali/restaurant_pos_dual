"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, LogOut, X } from "lucide-react";
import { NAV_ITEMS, type AdminRole } from "@/lib/admin/constants";
import { SidebarNavItem } from "./SidebarNavItem";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  role: AdminRole | undefined;
  onLogout: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  role,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-ember-soft)]">
          <span className="admin-ember-dot h-2.5 w-2.5 rounded-full bg-[var(--admin-ember)]" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="whitespace-nowrap font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
                Pizza Town
              </p>
              <p className="whitespace-nowrap text-xs text-[var(--admin-text-faint)]">Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {visibleItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
        ))}
      </nav>

      <div className="border-t border-[var(--admin-border)] p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-crust-soft)] hover:text-[var(--admin-crust)]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="mt-1 hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)] lg:flex"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4 shrink-0" /> : <PanelLeftClose className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-[var(--admin-border)] bg-[var(--admin-surface)] lg:block"
      >
        {content}
      </motion.aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--admin-border)] bg-[var(--admin-surface)] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
