"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 py-12 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-[var(--admin-text)]">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
