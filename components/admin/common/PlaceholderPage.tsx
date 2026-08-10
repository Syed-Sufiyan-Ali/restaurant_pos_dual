"use client";

import { motion } from "framer-motion";

interface PlaceholderPageProps {
  title: string;
  phase: string;
  description: string;
}

/**
 * Marks routing/navigation as wired up before a section has real content.
 * Swapped out page-by-page as each phase (Dashboard, Orders, Menu, ...) is built.
 */
export function PlaceholderPage({ title, phase, description }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-12 text-center"
    >
      <span className="mb-3 inline-flex items-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--admin-text-muted)]">
        {phase}
      </span>
      <h1 className="font-[family-name:var(--font-admin-display)] text-2xl font-semibold text-[var(--admin-text)]">
        {title}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--admin-text-muted)]">{description}</p>
    </motion.div>
  );
}
