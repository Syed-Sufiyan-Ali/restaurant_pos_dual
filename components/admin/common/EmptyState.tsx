import { Inbox, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  compact?: boolean;
}

export function EmptyState({ title, description, icon: Icon = Inbox, action, compact }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--admin-border)] text-center ${
        compact ? "p-6" : "p-12"
      }`}
    >
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-surface-2)] text-[var(--admin-text-faint)]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-[var(--admin-text)]">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-[var(--admin-text-muted)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
