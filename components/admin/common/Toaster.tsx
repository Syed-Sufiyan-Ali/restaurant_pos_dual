"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useToast, type ToastTone } from "@/lib/admin/toast";

const toneConfig: Record<ToastTone, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-[var(--admin-basil)]" },
  error: { icon: AlertCircle, className: "text-[var(--admin-crust)]" },
  info: { icon: Info, className: "text-[var(--admin-ember)]" },
};

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { icon: Icon, className } = toneConfig[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-[var(--admin-shadow)]"
            >
              <Icon className={`h-4 w-4 shrink-0 ${className}`} />
              <p className="flex-1 text-sm text-[var(--admin-text)]">{toast.message}</p>
              <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
                <X className="h-3.5 w-3.5 text-[var(--admin-text-faint)]" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
