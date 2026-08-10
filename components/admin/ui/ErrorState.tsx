"use client";

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--admin-text)]">Something went wrong</p>
        <p className="mt-1 text-xs text-[var(--admin-text-muted)]">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 h-8 rounded-lg bg-[var(--admin-accent)] px-4 text-xs font-medium text-white hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
