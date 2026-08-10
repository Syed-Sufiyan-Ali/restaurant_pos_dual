import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/admin/utils";

type Tone = "default" | "ember" | "basil" | "semolina" | "crust";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}

const toneClasses: Record<Tone, string> = {
  default: "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]",
  ember: "bg-[var(--admin-ember-soft)] text-[var(--admin-ember)]",
  basil: "bg-[var(--admin-basil-soft)] text-[var(--admin-basil)]",
  semolina: "bg-[var(--admin-semolina-soft)] text-[var(--admin-semolina)]",
  crust: "bg-[var(--admin-crust-soft)] text-[var(--admin-crust)]",
};

export function StatsCard({ label, value, icon: Icon, tone = "default", hint }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 transition-colors hover:border-[var(--admin-border-strong)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--admin-text-faint)]">{label}</span>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-[family-name:var(--font-admin-display)] text-2xl font-semibold text-[var(--admin-text)]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--admin-text-faint)]">{hint}</p>}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-[var(--admin-surface-2)]" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--admin-surface-2)]" />
      </div>
      <div className="mt-3 h-7 w-16 animate-pulse rounded bg-[var(--admin-surface-2)]" />
    </div>
  );
}
