"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, LayoutGrid, List } from "lucide-react";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/common/SearchInput";
import { Pagination } from "@/components/admin/ui/Pagination";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { LoadingScreen } from "@/components/admin/ui/LoadingScreen";
import { ErrorState } from "@/components/admin/ui/ErrorState";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ToasterProvider, useToast } from "@/components/admin/ui/Toaster";

import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";
import { MenuItemsTable } from "@/components/admin/tables/MenuItemsTable";

import { CategoryModal } from "@/components/admin/modals/CategoryModal";
import { MenuItemModal } from "@/components/admin/modals/MenuItemModal";

import {
  fetchCategories,
  fetchMenuItems,
  deleteCategory,
  deleteMenuItem,
  toggleMenuItemAvailable,
  toggleMenuItemFeatured,
  type MenuCategory,
  type MenuItem,
} from "@/lib/admin/menu-api";
import type { PaginatedResult } from "@/lib/admin/types";

const PAGE_SIZE = 15;

// ─── Wrapped with Toaster so useToast works ───────────────────────────────────
export default function MenuPage() {
  return (
    <ToasterProvider>
      <MenuPageInner />
    </ToasterProvider>
  );
}

function MenuPageInner() {
  const { toast } = useToast();

  // ─── Categories state ──────────────────────────────────────────────────────
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);
  const [catsOpen, setCatsOpen] = useState(true); // collapsible section

  // ─── Menu items state ──────────────────────────────────────────────────────
  const [result, setResult] = useState<PaginatedResult<MenuItem> | null>(null);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // ─── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Modals ────────────────────────────────────────────────────────────────
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // ─── Delete confirms ───────────────────────────────────────────────────────
  const [deletingCat, setDeletingCat] = useState<MenuCategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Fetch categories ──────────────────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    setCatsLoading(true);
    setCatsError(null);
    const res = await fetchCategories();
    setCatsLoading(false);
    if (res.success) setCategories(res.data);
    else setCatsError(res.message);
  }, []);

  // ─── Fetch menu items ──────────────────────────────────────────────────────
  const loadItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError(null);
    const res = await fetchMenuItems({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      category: categoryFilter || undefined,
    });
    setItemsLoading(false);
    if (res.success) setResult(res.data);
    else setItemsError(res.message);
  }, [page, search, categoryFilter]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  // Debounce search, reset page
  useEffect(() => {
  if (searchTimeout.current) {
    clearTimeout(searchTimeout.current);
  }

  searchTimeout.current = setTimeout(() => {
    setPage(1);
    loadItems();
  }, 300);

  return () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  };
}, [search, categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadItems(); }, [loadItems]);

  // ─── Delete handlers ───────────────────────────────────────────────────────
  async function handleDeleteCategory() {
    if (!deletingCat) return;
    setDeleteLoading(true);
    const res = await deleteCategory(deletingCat.id);
    setDeleteLoading(false);
    if (res.success) {
      toast("Category deleted.", "success");
      setDeletingCat(null);
      loadCategories();
      loadItems();
    } else {
      toast(res.message, "error");
    }
  }

  async function handleDeleteItem() {
    if (!deletingItem) return;
    setDeleteLoading(true);
    const res = await deleteMenuItem(deletingItem.id);
    setDeleteLoading(false);
    if (res.success) {
      toast("Item deleted.", "success");
      setDeletingItem(null);
      loadItems();
    } else {
      toast(res.message, "error");
    }
  }

  // ─── Toggle handlers ───────────────────────────────────────────────────────
  async function handleToggleAvailable(item: MenuItem) {
    const res = await toggleMenuItemAvailable(item.id, !item.isAvailable);
    if (res.success) {
      toast(
        res.data.isAvailable ? `"${item.name}" is now available.` : `"${item.name}" marked unavailable.`,
        "success"
      );
      loadItems();
    } else {
      toast(res.message, "error");
    }
  }

  async function handleToggleFeatured(item: MenuItem) {
    const res = await toggleMenuItemFeatured(item.id, !item.isFeatured);
    if (res.success) {
      toast(
        res.data.isFeatured ? `"${item.name}" added to featured.` : `"${item.name}" removed from featured.`,
        "success"
      );
      loadItems();
    } else {
      toast(res.message, "error");
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* Page header */}
      <PageHeader
        title="Menu"
        description="Manage categories and menu items."
        actions={
          <button
            onClick={() => { setEditingItem(null); setItemModalOpen(true); }}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[var(--admin-accent)] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus size={15} />
            Add Item
          </button>
        }
      />

      {/* ── Categories Section ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--admin-border)]">
          <button
            onClick={() => setCatsOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]"
          >
            <LayoutGrid size={15} className="text-[var(--admin-text-muted)]" />
            Categories
            {categories.length > 0 && (
              <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2 py-0.5 text-xs font-normal text-[var(--admin-text-muted)]">
                {categories.length}
              </span>
            )}
            {catsOpen ? (
              <ChevronUp size={14} className="text-[var(--admin-text-muted)]" />
            ) : (
              <ChevronDown size={14} className="text-[var(--admin-text-muted)]" />
            )}
          </button>
          <button
            onClick={() => { setEditingCat(null); setCatModalOpen(true); }}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 text-xs font-medium text-[var(--admin-text)] transition-colors hover:bg-[var(--admin-border)]"
          >
            <Plus size={13} />
            Add Category
          </button>
        </div>

        {/* Section body */}
        {catsOpen && (
          <div className="p-5">
            {catsLoading ? (
              <LoadingScreen message="Loading categories…" />
            ) : catsError ? (
              <ErrorState message={catsError} onRetry={loadCategories} />
            ) : categories.length === 0 ? (
              <EmptyState
                icon={<LayoutGrid size={20} />}
                title="No categories yet"
                description="Create a category before adding menu items."
                action={
                  <button
                    onClick={() => { setEditingCat(null); setCatModalOpen(true); }}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--admin-accent)] px-3 text-xs font-medium text-white hover:opacity-90"
                  >
                    <Plus size={13} />
                    Add Category
                  </button>
                }
              />
            ) : (
              <CategoriesTable
                categories={categories}
                onEdit={(cat) => { setEditingCat(cat); setCatModalOpen(true); }}
                onDelete={setDeletingCat}
              />
            )}
          </div>
        )}
      </section>

      {/* ── Menu Items Section ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
        {/* Section header */}
        <div className="flex flex-col gap-3 border-b border-[var(--admin-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <List size={15} className="text-[var(--admin-text-muted)]" />
            <span className="text-sm font-semibold text-[var(--admin-text)]">Menu Items</span>
            {result && (
              <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-2 py-0.5 text-xs font-normal text-[var(--admin-text-muted)]">
                {result.total}
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="h-9 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-xs text-[var(--admin-text)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search items…"
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Section body */}
        <div className="p-5">
          {itemsLoading ? (
            <LoadingScreen message="Loading menu items…" />
          ) : itemsError ? (
            <ErrorState message={itemsError} onRetry={loadItems} />
          ) : !result || result.items.length === 0 ? (
            <EmptyState
              icon={<List size={20} />}
              title={search || categoryFilter ? "No items match your filters" : "No menu items yet"}
              description={
                search || categoryFilter
                  ? "Try a different search or category."
                  : "Add your first item to get started."
              }
              action={
                !search && !categoryFilter ? (
                  <button
                    onClick={() => { setEditingItem(null); setItemModalOpen(true); }}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--admin-accent)] px-3 text-xs font-medium text-white hover:opacity-90"
                  >
                    <Plus size={13} />
                    Add Item
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <MenuItemsTable
                items={result.items}
                onEdit={(item) => { setEditingItem(item); setItemModalOpen(true); }}
                onDelete={setDeletingItem}
                onToggleAvailable={handleToggleAvailable}
                onToggleFeatured={handleToggleFeatured}
              />
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
                pageSize={result.limit}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <CategoryModal
        open={catModalOpen}
        category={editingCat}
        onClose={() => setCatModalOpen(false)}
        onSaved={loadCategories}
      />

      <MenuItemModal
        open={itemModalOpen}
        item={editingItem}
        categories={categories}
        onClose={() => setItemModalOpen(false)}
        onSaved={loadItems}
      />

      {/* ── Confirm dialogs ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deletingCat)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCat?.name}"? This may affect menu items in this category.`}
        confirmLabel="Delete"
        destructive
        loading={deleteLoading}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeletingCat(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingItem)}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${deletingItem?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteLoading}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeletingItem(null)}
      />
    </motion.div>
  );
}
