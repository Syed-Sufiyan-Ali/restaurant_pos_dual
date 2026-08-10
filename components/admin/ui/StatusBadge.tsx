"use client";

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-[var(--admin-text-muted)]"}`}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
