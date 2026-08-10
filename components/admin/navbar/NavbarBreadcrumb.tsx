"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/admin/constants";

export function NavbarBreadcrumb() {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));

  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] uppercase tracking-wide text-[var(--admin-text-faint)]">Pizza Town / Admin</span>
      <span className="font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
        {current?.label ?? "Dashboard"}
      </span>
    </div>
  );
}
