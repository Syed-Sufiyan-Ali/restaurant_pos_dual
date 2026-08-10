"use client";

import { EmptyState } from "@/components/admin/common/EmptyState";
import { ErrorState } from "@/components/admin/common/ErrorState";
import type { LoadState, RevenuePoint } from "@/lib/admin/types";
import { formatShortDate } from "@/lib/admin/utils";

interface RevenueChartProps {
  state: LoadState<RevenuePoint[]>;
}

// A small hand-rolled SVG chart rather than pulling in a charting library —
// the existing project's stack is Tailwind + Framer Motion + Lucide only.
export function RevenueChart({ state }: RevenueChartProps) {
  return (
    <div className="h-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
      <h2 className="mb-4 font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
        Revenue, last 7 days
      </h2>

      {state.status === "loading" && <div className="h-56 animate-pulse rounded-xl bg-[var(--admin-surface-2)]" />}
      {state.status === "error" && <ErrorState compact message={state.message} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyState compact title="No revenue yet" description="Once orders come in, the trend will show up here." />
      )}
      {state.status === "success" && state.data.length > 0 && <Chart points={state.data} />}
    </div>
  );
}

function Chart({ points }: { points: RevenuePoint[] }) {
  const width = 600;
  const height = 220;
  const padding = 16;
  const max = Math.max(...points.map((p) => p.revenue), 1);

  const coords = points.map((point, index) => {
    const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (point.revenue / max) * (height - padding * 2);
    return { x, y, ...point };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="admin-revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--admin-ember)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--admin-ember)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#admin-revenue-fill)" />
        <path d={linePath} fill="none" stroke="var(--admin-ember)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c) => (
          <circle key={c.date} cx={c.x} cy={c.y} r="3" fill="var(--admin-ember)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-[var(--admin-text-faint)]">
        {points.map((p) => (
          <span key={p.date}>{formatShortDate(p.date)}</span>
        ))}
      </div>
    </div>
  );
}
