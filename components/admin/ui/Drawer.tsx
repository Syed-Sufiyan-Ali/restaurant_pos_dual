"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-lg",
}: DrawerProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={`relative z-10 flex h-full w-full ${width} flex-col bg-[var(--admin-surface)] shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--admin-border)] px-6 py-4">
              <div>
                <h2 className="font-[family-name:var(--font-admin-display)] text-base font-semibold text-[var(--admin-text)]">
                  {title}
                </h2>
                {description && (
                  <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
