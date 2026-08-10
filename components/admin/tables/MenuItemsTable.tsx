"use client";

import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { MenuItem } from "@/lib/admin/menu-api";

interface MenuItemsTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailable: (item: MenuItem) => void;
  onToggleFeatured: (item: MenuItem) => void;
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export function MenuItemsTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailable,
  onToggleFeatured,
}: MenuItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-2)]">
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Item
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-text-muted)]">
              Featured
            </th>
            <th className="w-28 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {items.map((item) => {
            const primaryImage = item.images?.[0];
            return (
              <tr
                key={item.id}
                className="bg-[var(--admin-surface)] transition-colors hover:bg-[var(--admin-surface-2)]"
              >
                {/* Item name + image */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)]">
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg">
                          🍕
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">{item.name}</p>
                      {item.description && (
                        <p className="mt-0.5 max-w-[240px] truncate text-xs text-[var(--admin-text-muted)]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2 py-0.5 text-xs text-[var(--admin-text-muted)]">
                    {item.category.name}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 font-medium text-[var(--admin-text)]">
                  {formatPrice(Number(item.basePrice))}
                </td>

                {/* Available toggle */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleAvailable(item)}
                    title={item.isAvailable ? "Mark unavailable" : "Mark available"}
                    className="group flex items-center gap-1.5"
                  >
                    <StatusBadge
                      active={item.isAvailable}
                      activeLabel="Available"
                      inactiveLabel="Unavailable"
                    />
                    <span className="hidden text-[var(--admin-text-muted)] group-hover:inline-block">
                      {item.isAvailable ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                    </span>
                  </button>
                </td>

                {/* Featured toggle */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleFeatured(item)}
                    title={item.isFeatured ? "Remove from featured" : "Add to featured"}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      item.isFeatured
                        ? "text-amber-500 hover:bg-amber-500/10"
                        : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-amber-500"
                    }`}
                  >
                    <Star size={14} fill={item.isFeatured ? "currentColor" : "none"} />
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]"
                      title="Edit item"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                      title="Delete item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
