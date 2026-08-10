"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { fetchDashboardStats } from "@/lib/admin/dashboard-api";
import type { DashboardStats } from "@/lib/admin/types";

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay }}
      className="flex items-center gap-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm"
    >
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tabular-nums text-[var(--admin-text)]">{value}</p>
        <p className="mt-0.5 truncate text-xs text-[var(--admin-text-muted)]">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, delay }}
      className="flex items-center gap-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm"
    >
      <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-xl bg-[var(--admin-surface-2)]" />
      <div className="flex flex-col gap-2">
        <div className="h-7 w-20 animate-pulse rounded-lg bg-[var(--admin-surface-2)]" />
        <div className="h-3 w-28 animate-pulse rounded-md bg-[var(--admin-surface-2)]" />
      </div>
    </motion.div>
  );
}

// ─── Card config ──────────────────────────────────────────────────────────────

interface CardConfig {
  key: keyof DashboardStats;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  format: (v: any) => string;
}

const CARDS: CardConfig[] = [
  {
    key: "todayRevenue",
    label: "Today's Revenue",
    icon: Banknote,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    format: (v) => `Rs. ${Number(v || 0).toLocaleString("en-PK", { minimumFractionDigits: 0 })}`,
  },
  {
    key: "todayOrders",
    label: "Today's Orders",
    icon: ShoppingBag,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    format: (v) => String(v),
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    icon: Clock,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    format: (v) => String(v),
  },
  {
    key: "preparingOrders",
    label: "Preparing",
    icon: ChefHat,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    format: (v) => String(v),
  },
  {
    key: "deliveredToday",
    label: "Delivered Today",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    format: (v) => String(v),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

async function load() {
  setLoading(true);
  setError(null);

  const res = await fetchDashboardStats();

  setLoading(false);

  if (res.success) {
    console.log("Dashboard response:", res.data);

    setStats(res.data);
  } else {
    setError(res.message);
  }
}

  useEffect(() => {
    load();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-xl font-semibold text-[var(--admin-text)]">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-[var(--admin-text-muted)]">
          Today's overview at a glance.
        </p>
      </div>

      {/* Error state */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0 text-red-500" />
            <p className="text-xs text-red-500">{error}</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </motion.div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? CARDS.map((_, i) => <SkeletonCard key={i} delay={i * 0.04} />)
          : stats
          ? CARDS.map((card, i) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={card.format(stats[card.key])}
                icon={card.icon}
                iconColor={card.iconColor}
                iconBg={card.iconBg}
                delay={i * 0.04}
              />
            ))
          : null}
      </div>
    </motion.div>
  );
}
