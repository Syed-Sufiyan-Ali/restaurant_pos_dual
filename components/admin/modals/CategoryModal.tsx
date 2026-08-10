"use client";

import React, { useEffect, useState } from "react";
import { Drawer } from "@/components/admin/ui/Drawer";
import { createCategory, updateCategory, type MenuCategory, type CategoryPayload } from "@/lib/admin/menu-api";
import { useToast } from "@/components/admin/ui/Toaster";

interface CategoryModalProps {
  open: boolean;
  category: MenuCategory | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: CategoryPayload = {
  slug: "",
  name: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export function CategoryModal({ open, category, onClose, onSaved }: CategoryModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<CategoryPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryPayload, string>>>({});

  const isEdit = Boolean(category);

  useEffect(() => {
    if (open) {
      setForm(
        category
          ? {
              name: category.name,
              slug: category.slug,
              description: category.description ?? "",
              sortOrder: category.sortOrder,
              isActive: category.isActive,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, category]);

  function set<K extends keyof CategoryPayload>(key: K, value: CategoryPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);

    const res = isEdit
      ? await updateCategory(category!.id, form)
      : await createCategory(form);

    setSaving(false);

    if (res.success) {
      toast(isEdit ? "Category updated." : "Category created.", "success");
      onSaved();
      onClose();
    } else {
      toast(res.message, "error");
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "New Category"}
      description={isEdit ? `Editing "${category?.name}"` : "Add a new menu category."}
    >
      <div className="flex flex-col gap-5">
        {/* Name */}
        <Field label="Name" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Pizzas"
            className={inputCls(!!errors.name)}
          />
        </Field>
        <Field label="Slug" required>
  <input
    type="text"
    value={form.slug}
    onChange={(e) => set("slug", e.target.value)}
    placeholder="pizzas"
    className={inputCls(!!errors.slug)}
  />
</Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional short description"
            rows={3}
            className={`${inputCls(false)} resize-none`}
          />
        </Field>

        {/* Sort Order */}
        <Field label="Sort Order" hint="Lower numbers appear first.">
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className={inputCls(false)}
          />
        </Field>

        {/* Active */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--admin-text)]">Active</p>
            <p className="text-xs text-[var(--admin-text-muted)]">
              Inactive categories are hidden from the menu.
            </p>
          </div>
          <Toggle checked={form.isActive ?? true} onChange={(v) => set("isActive", v)} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 h-10 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-sm font-medium text-[var(--admin-text)] transition-colors hover:bg-[var(--admin-surface-2)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-10 rounded-xl bg-[var(--admin-accent)] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--admin-text)]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--admin-text-muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border)]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

// ─── Input class helper ────────────────────────────────────────────────────────
function inputCls(hasError: boolean) {
  return `h-9 w-full rounded-lg border px-3 text-sm text-[var(--admin-text)] bg-[var(--admin-surface)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-[var(--admin-border)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
  }`;
}
