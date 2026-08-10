"use client";

import { Pencil, Trash2, GripVertical } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { MenuCategory } from "@/lib/admin/menu-api";

interface CategoriesTableProps {
  categories: MenuCategory[];
  onEdit: (category: MenuCategory) => void;
  onDelete: (category: MenuCategory) => void;
}

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)]">
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Order
            </th>
            <th className="w-20 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {categories.map((cat) => (
            <tr
              key={cat.id}
              className="bg-[var(--admin-surface)] transition-colors hover:bg-[var(--admin-surface-2)]"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <GripVertical
                    size={14}
                    className="flex-shrink-0 text-[var(--admin-text-muted)] opacity-40"
                  />
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">{cat.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                _
              </td>
              <td className="px-4 py-3">
                <StatusBadge active /> 
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">_</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(cat)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
                    title="Edit category"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
