"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-start gap-3">
              {destructive && (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
              )}
              <div>
                <h3 className="font-[family-name:var(--font-admin-display)] text-sm font-semibold text-[var(--admin-text)]">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">{description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                disabled={loading}
                className="h-9 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 text-xs font-medium text-[var(--admin-text)] transition-colors hover:bg-[var(--admin-surface-2)] disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`h-9 rounded-lg px-4 text-xs font-medium text-white transition-opacity disabled:opacity-60 ${
                  destructive ? "bg-red-500 hover:bg-red-600" : "bg-[var(--admin-accent)] hover:opacity-90"
                }`}
              >
                {loading ? "Please wait…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
