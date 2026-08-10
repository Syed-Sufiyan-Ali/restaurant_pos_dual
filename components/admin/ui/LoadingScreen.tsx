"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading…" }: LoadingScreenProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Loader2 size={22} className="animate-spin text-[var(--admin-accent)]" />
      <p className="text-sm text-[var(--admin-text-muted)]">{message}</p>
    </div>
  );
}
