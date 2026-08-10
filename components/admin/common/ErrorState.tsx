"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({ message, onRetry, compact }: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-[var(--admin-crust-soft)] bg-[var(--admin-crust-soft)] text-center ${
        compact ? "p-6" : "p-12"
      }`}
    >
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-surface)] text-[var(--admin-crust)]">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-[var(--admin-text)]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-1.5 text-xs font-medium text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)]"
        >
          <RotateCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
