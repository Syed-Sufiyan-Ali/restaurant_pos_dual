"use client";

import type { Customer } from "@/lib/admin/types";
import { GuestBadge } from "@/components/admin/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/admin/utils";

interface CustomersTableProps {
  customers: Customer[];
  onSelect: (id: string) => void;
}

export function CustomersTable({ customers, onSelect }: CustomersTableProps) {
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wide text-[var(--admin-text-faint)]">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Orders</th>
            <th className="px-4 py-3 font-medium">Total spent</th>
            <th className="px-4 py-3 font-medium">Last order</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {customers.map((customer) => (
            <tr key={customer.id} className="cursor-pointer hover:bg-[var(--admin-surface-hover)]" onClick={() => onSelect(customer.id)}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--admin-text)]">{customer.name}</span>
                  <GuestBadge isGuest={customer.isGuest} />
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">{customer.phone ?? "—"}</td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">{customer.email ?? "—"}</td>
              <td className="px-4 py-3 text-[var(--admin-text)]">{customer.totalOrders}</td>
              <td className="px-4 py-3 font-medium text-[var(--admin-text)]">{formatCurrency(customer.totalSpent)}</td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-[var(--admin-border)] md:hidden">
        {customers.map((customer) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => onSelect(customer.id)}
            className="flex w-full flex-col gap-2 px-4 py-3 text-left hover:bg-[var(--admin-surface-hover)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--admin-text)]">{customer.name}</span>
              <GuestBadge isGuest={customer.isGuest} />
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
              <span>{customer.phone ?? "—"}</span>
              <span className="font-medium text-[var(--admin-text)]">{formatCurrency(customer.totalSpent)}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
