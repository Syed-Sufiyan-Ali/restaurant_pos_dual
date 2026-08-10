"use client";

import { EmptyState } from "@/components/admin/common/EmptyState";
import { ErrorState } from "@/components/admin/common/ErrorState";
import type { LoadState, TopSellingItem } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/admin/utils";

interface TopSellingItemsProps {
  state: LoadState<TopSellingItem[]>;
}

export function TopSellingItems({ state }: TopSellingItemsProps) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
      <h2 className="mb-4 font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
        Top selling items
      </h2>

      {state.status === "loading" && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--admin-surface-2)]" />
          ))}
        </div>
      )}
      {state.status === "error" && <ErrorState compact message={state.message} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyState compact title="Nothing sold yet" description="Best sellers will appear once orders come in." />
      )}
      {state.status === "success" && state.data.length > 0 && <List items={state.data} />}
    </div>
  );
}

function List({ items }: { items: TopSellingItem[] }) {
  const max = Math.max(...items.map((i) => i.unitsSold), 1);

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item.id}>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[var(--admin-text)]">
              <span className="font-[family-name:var(--font-admin-mono)] text-xs text-[var(--admin-text-faint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.name}
            </span>
            <span className="text-xs text-[var(--admin-text-faint)]">{formatCurrency(item.revenue)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--admin-surface-2)]">
            <div className="h-full rounded-full bg-[var(--admin-ember)]" style={{ width: `${(item.unitsSold / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
