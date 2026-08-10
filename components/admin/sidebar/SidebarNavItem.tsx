"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/admin/constants";
import { cn } from "@/lib/admin/utils";

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}

export function SidebarNavItem({ item, active, collapsed, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-[var(--admin-ember-soft)] text-[var(--admin-ember)]"
          : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]"
      )}
    >
      {active && <span className="admin-ember-dot absolute left-0 h-5 w-0.5 rounded-r-full bg-[var(--admin-ember)]" />}
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
    </Link>
  );
}
