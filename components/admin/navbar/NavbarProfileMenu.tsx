"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import type { AdminUser } from "@/lib/admin/hooks";
import { getInitials, getRoleLabel } from "@/lib/admin/utils";

interface NavbarProfileMenuProps {
  user: AdminUser | null;
  onLogout: () => void;
}

export function NavbarProfileMenu({ user, onLogout }: NavbarProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = user?.name || "Admin";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-[var(--admin-surface-hover)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-ember-soft)] text-xs font-semibold text-[var(--admin-ember)]">
          {getInitials(displayName)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-[var(--admin-text)]">{displayName}</span>
          <span className="block text-xs text-[var(--admin-text-faint)]">{user ? getRoleLabel(user.role) : ""}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-[var(--admin-text-faint)] sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-1 shadow-[var(--admin-shadow)]">
          <div className="border-b border-[var(--admin-border)] px-3 py-2">
            <p className="text-sm font-medium text-[var(--admin-text)]">{displayName}</p>
            <p className="text-xs text-[var(--admin-text-faint)]">{user ? getRoleLabel(user.role) : ""}</p>
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)]"
          >
            <UserIcon className="h-4 w-4" /> My profile
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--admin-crust)] hover:bg-[var(--admin-crust-soft)]"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
