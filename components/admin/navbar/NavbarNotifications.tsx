"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

export function NavbarNotifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-text)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)]">
          <p className="text-sm font-medium text-[var(--admin-text)]">Notifications</p>
          {/* TODO: wire up to a real notifications endpoint once one exists.
              Intentionally showing an honest empty state instead of fake data. */}
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
            You&apos;re all caught up. New order and reservation alerts will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
