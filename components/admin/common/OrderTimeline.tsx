"use client";

import type { OrderTimelineEntry } from "@/lib/admin/types";
import { STATUS_MAP } from "@/components/admin/orders/OrderStatusBadge";

interface OrderTimelineProps {
  timeline: OrderTimelineEntry[];
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-xs text-[var(--admin-text-muted)]">No timeline entries yet.</p>
    );
  }

  // Show newest first
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ol className="relative flex flex-col gap-0">
      {sorted.map((entry, idx) => {
        const cfg = STATUS_MAP[entry.status];
        const isLast = idx === sorted.length - 1;

        return (
          <li key={idx} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[7px] top-4 h-full w-px bg-[var(--admin-border)]" />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[var(--admin-surface)] ${
                cfg ? cfg.dot : "bg-[var(--admin-text-muted)]"
              }`}
            />

            {/* Content */}
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium text-[var(--admin-text)]">
                {cfg?.label ?? entry.status}
              </p>
              {entry.note && (
                <p className="text-xs text-[var(--admin-text-muted)]">{entry.note}</p>
              )}
              <p className="text-[11px] text-[var(--admin-text-muted)]">
                {formatDateTime(entry.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
