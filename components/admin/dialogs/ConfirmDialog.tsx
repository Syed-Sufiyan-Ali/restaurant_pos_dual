"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "ember" | "crust";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "ember",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
  if (!isLoading) onCancel();
}}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                tone === "crust" ? "bg-[var(--admin-crust-soft)] text-[var(--admin-crust)]" : "bg-[var(--admin-ember-soft)] text-[var(--admin-ember)]"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-[family-name:var(--font-admin-display)] text-base font-semibold text-[var(--admin-text)]">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-[var(--admin-text-muted)]">{description}</p>}
            <div className="mt-5 flex justify-end gap-2">
    <button
  type="button"
  disabled={isLoading}
  onClick={() => {
    if (!isLoading) onCancel();
  }}
               className="rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 ${
                  tone === "crust" ? "bg-[var(--admin-crust)]" : "bg-[var(--admin-ember)]"
                }`}
              >
                {isLoading ? (
  <span className="flex items-center justify-center gap-2">
    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
    Working…
  </span>
) : (
  confirmLabel
)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
