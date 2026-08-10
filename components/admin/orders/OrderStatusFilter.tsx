"use client";

interface Tab {
  value: string;
  label: string;
}

const TABS: Tab[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "ON_THE_WAY", label: "On The Way" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface OrderStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrderStatusFilter({ value, onChange }: OrderStatusFilterProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`h-8 flex-shrink-0 rounded-lg px-3 text-xs font-medium transition-colors ${
              active
                ? "bg-[var(--admin-accent)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
