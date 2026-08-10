"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { Drawer } from "@/components/admin/ui/Drawer";
import { useToast } from "@/components/admin/ui/Toaster";
import {
  createMenuItem,
  updateMenuItem,
  uploadMenuItemImage,
  type MenuItem,
  type MenuCategory,
  type MenuItemPayload,
} from "@/lib/admin/menu-api";

interface MenuItemModalProps {
  open: boolean;
  item: MenuItem | null; // null = create mode
  categories: MenuCategory[];
  onClose: () => void;
  onSaved: () => void;
}

interface FormState extends MenuItemPayload {
  slug: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",

  categoryId: "",

  basePrice: 0,

  tag: "",

  sortOrder: 0,

  isAvailable: true,
  isFeatured: false,

  sizes: [],

  addons: [],

  ingredients: [],
};

export function MenuItemModal({
  open,
  item,
  categories,
  onClose,
  onSaved,
}: MenuItemModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Image upload state
  const [pendingImages, setPendingImages] = useState<
    { file: File; preview: string; uploading: boolean }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              slug: item.slug,
              name: item.name,
              description: item.description ?? "",
              basePrice: item.basePrice,
              tag: item.tag ?? "",
              sizes:
  item.sizes?.map((s) => ({
    label: s.label,
    priceAddon: s.priceAddon,
    serves: s.serves ?? undefined,
    isDefault: s.isDefault,
  })) ?? [],

addons:
  item.addons?.map((a) => ({
    label: a.label,
    price: Number(a.price),
  })) ?? [],

ingredients:
  item.ingredients?.map((i) => i.name) ?? [],
              categoryId: item.categoryId,
              isAvailable: item.isAvailable,
              isFeatured: item.isFeatured,
              sortOrder: item.sortOrder,
            }
          : { ...EMPTY_FORM, categoryId: categories[0]?.id ?? "" }
      );
      setErrors({});
      setPendingImages([]);
    }
  }, [open, item, categories]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.name.trim())
  errs.name = "Name is required.";

if (!form.slug.trim())
  errs.slug = "Slug is required.";
    if (!form.categoryId) errs.categoryId = "Select a category.";
    if (form.basePrice < 0) errs.basePrice = "Price must be 0 or more.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));
    setPendingImages((prev) => [...prev, ...previews]);
    e.target.value = "";
  }




  function removePending(index: number) {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }
  function addSize() {
  setForm((prev) => ({
    ...prev,
    sizes: [
      ...(prev?.sizes ?? []),
      {
        label: "",
        priceAddon: 0,
        serves: "",
        isDefault: (prev.sizes ?? []).length === 0,
      },
    ],
  }));
}
function updateSize(
  index: number,
  key: "label" | "priceAddon" | "serves" | "isDefault",
  value: string | number | boolean
) {
  setForm((prev) => ({
    ...prev,
    sizes: (prev.sizes ?? []).map((size, i) =>
      i === index
        ? { ...size, [key]: value }
        : key === "isDefault" && value === true
        ? { ...size, isDefault: false }
        : size
    ),
  }));
}
function removeSize(index: number) {
  setForm((prev) => ({
    ...prev,
    sizes: (prev.sizes ?? []).filter((_, i) => i !== index),
  }));
}
function addAddon() {
  setForm((prev) => ({
    ...prev,
    addons: [
      ...(prev.addons ?? []),
      {
        label: "",
        price: 0,
      },
    ],
  }));
}

function updateAddon(
  index: number,
  key: "label" | "price",
  value: string | number
) {
  setForm((prev) => ({
    ...prev,
    addons: (prev.addons ?? []).map((addon, i) =>
      i === index
        ? { ...addon, [key]: value }
        : addon
    ),
  }));
}

function removeAddon(index: number) {
  setForm((prev) => ({
    ...prev,
    addons: (prev.addons ?? []).filter((_, i) => i !== index),
  }));
}
function addIngredient() {
  setForm((prev) => ({
    ...prev,
    ingredients: [...(prev.ingredients ?? []), ""],
  }));
}

function updateIngredient(index: number, value: string) {
  setForm((prev) => ({
    ...prev,
    ingredients: (prev.ingredients ?? []).map((ingredient, i) =>
      i === index ? value : ingredient
    ),
  }));
}

function removeIngredient(index: number) {
  setForm((prev) => ({
    ...prev,
    ingredients: (prev.ingredients ?? []).filter((_, i) => i !== index),
  }));
}
  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);

    // 1. Create or update the item
    const payload: MenuItemPayload = {
      
      name: form.name.trim(),
  slug: form.slug.trim(),
  description: form.description.trim() || undefined,

  categoryId: form.categoryId,

  basePrice: Number(form.basePrice),

  tag: form.tag || undefined,

  sortOrder: form.sortOrder,

  isAvailable: form.isAvailable,
  isFeatured: form.isFeatured,

  sizes: form.sizes,
  addons: form.addons,
  ingredients: form.ingredients,
    };

    const res = isEdit
      ? await updateMenuItem(item!.id, payload)
      : await createMenuItem(payload);

    if (!res.success) {
      setSaving(false);
      toast(res.message, "error");
      return;
    }

    const savedId = res.data.id;

    // 2. Upload pending images (for create, need the new id; for edit, use existing)
    if (pendingImages.length > 0) {
      setPendingImages((prev) => prev.map((img) => ({ ...img, uploading: true })));

      const existingCount = item?.images?.length ?? 0;

      await Promise.all(
        pendingImages.map(async (img, idx) => {
          const isPrimary = existingCount === 0 && idx === 0;
          await uploadMenuItemImage(savedId, img.file, isPrimary);
        })
      );
    }

    setSaving(false);
    toast(isEdit ? "Item updated." : "Item created.", "success");
    onSaved();
    onClose();
  }

  const existingImages = item?.images ?? [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Menu Item" : "New Menu Item"}
      description={isEdit ? `Editing "${item?.name}"` : "Add a new item to the menu."}
      width="max-w-xl"
    >
      <div className="flex flex-col gap-5">
        {/* Name */}
        <Field label="Name" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
  const value = e.target.value;

  set("name", value);

  if (!isEdit) {
    set(
      "slug",
      value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  }
}}
            placeholder="e.g. Margherita Pizza"
            className={inputCls(!!errors.name)}
          />
        </Field>
        <Field label="Slug" error={errors.slug} required>
  <input
    type="text"
    value={form.slug}
    onChange={(e) => set("slug", e.target.value)}
    placeholder="margherita-pizza"
    className={inputCls(!!errors.slug)}
  />
</Field>
        {/* Description */}
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description shown on the menu"
            rows={3}
            className={`${inputCls(false)} resize-none`}
          />
        </Field>

        {/* Price + Category row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Base Price (Rs.)" error={errors.basePrice as string} required>
            <input
              type="number"
              min={0}
              value={form.basePrice}
              onChange={(e) => set("basePrice", Number(e.target.value))}
              className={inputCls(!!errors.basePrice)}
            />
          </Field>

          <Field label="Category" error={errors.categoryId} required>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={`${inputCls(!!errors.categoryId)} cursor-pointer`}
            >
              <option value="">Select…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
<Field label="Tag">
  <select
    value={form.tag ?? ""}
    onChange={(e) => set("tag", e.target.value)}
    className={`${inputCls(false)} cursor-pointer`}
  >
    <option value="">None</option>
    <option value="new">New</option>
    <option value="bestseller">Best Seller</option>
    <option value="spicy">Spicy</option>
    <option value="deal">Deal</option>
  </select>
</Field>
        {/* Sort Order */}
        <Field label="Sort Order" hint="Lower numbers appear first within the category.">
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className={inputCls(false)}
          />
        </Field>

        {/* Toggles row */}
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            label="Available"
            description="Visible and orderable."
            checked={form.isAvailable ?? true}
            onChange={(v) => set("isAvailable", v)}
          />
          <ToggleCard
            label="Featured"
            description="Highlighted on the homepage."
            checked={form.isFeatured ?? false}
            onChange={(v) => set("isFeatured", v)}
          />
        </div>
        {/* Sizes */}
<div className="flex flex-col gap-3">
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium text-[var(--admin-text)]">
      Sizes
    </label>

    <button
      type="button"
      onClick={addSize}
      className="rounded-lg border border-[var(--admin-border)] px-2 py-1 text-xs hover:bg-[var(--admin-surface-2)]"
    >
      + Add Size
    </button>
  </div>

  {(form.sizes ?? []).map((size, index) => (
    <div
      key={index}
      className="grid grid-cols-12 gap-2 rounded-lg border border-[var(--admin-border)] p-3"
    >
      <input
        className={`${inputCls(false)} col-span-4`}
        placeholder="Label"
        value={size.label}
        onChange={(e) =>
          updateSize(index, "label", e.target.value)
        }
      />

      <input
        className={`${inputCls(false)} col-span-3`}
        type="number"
        placeholder="Price"
        value={size.priceAddon}
        onChange={(e) =>
          updateSize(index, "priceAddon", Number(e.target.value))
        }
      />

      <input
        className={`${inputCls(false)} col-span-2`}
        placeholder="Serves"
        value={size.serves ?? ""}
        onChange={(e) =>
          updateSize(index, "serves", e.target.value)
        }
      />

      <label className="col-span-2 flex items-center justify-center gap-1 text-xs">
        <input
          type="radio"
          checked={size.isDefault}
          onChange={() =>
            updateSize(index, "isDefault", true)
          }
        />
        Default
      </label>

      <button
        type="button"
        onClick={() => removeSize(index)}
        className="col-span-1 text-red-500 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  ))}
</div>{/* Addons */}
<div className="flex flex-col gap-3">
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium text-[var(--admin-text)]">
      Addons
    </label>

    <button
      type="button"
      onClick={addAddon}
      className="rounded-lg border border-[var(--admin-border)] px-2 py-1 text-xs hover:bg-[var(--admin-surface-2)]"
    >
      + Add Addon
    </button>
  </div>

  {(form.addons ?? []).map((addon, index) => (
    <div
      key={index}
      className="grid grid-cols-12 gap-2 rounded-lg border border-[var(--admin-border)] p-3"
    >
      <input
        className={`${inputCls(false)} col-span-8`}
        placeholder="Addon name"
        value={addon.label}
        onChange={(e) =>
          updateAddon(index, "label", e.target.value)
        }
      />

      <input
        className={`${inputCls(false)} col-span-3`}
        type="number"
        placeholder="Price"
        value={addon.price}
        onChange={(e) =>
          updateAddon(index, "price", Number(e.target.value))
        }
      />

      <button
        type="button"
        onClick={() => removeAddon(index)}
        className="col-span-1 text-red-500 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  ))}
</div>
 {/* Ingredients */}
<div className="flex flex-col gap-3">
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium text-[var(--admin-text)]">
      Ingredients
    </label>

    <button
      type="button"
      onClick={addIngredient}
      className="rounded-lg border border-[var(--admin-border)] px-2 py-1 text-xs hover:bg-[var(--admin-surface-2)]"
    >
      + Add Ingredient
    </button>
  </div>

  {(form.ingredients ?? []).map((ingredient, index) => (
    <div
      key={index}
      className="grid grid-cols-12 gap-2 rounded-lg border border-[var(--admin-border)] p-3"
    >
      <input
        className={`${inputCls(false)} col-span-11`}
        placeholder="Ingredient"
        value={ingredient}
        onChange={(e) =>
          updateIngredient(index, e.target.value)
        }
      />

      <button
        type="button"
        onClick={() => removeIngredient(index)}
        className="col-span-1 text-red-500 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  ))}
</div>
        {/* Images section */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--admin-text)]">Images</label>

          {/* Existing images (edit mode) */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--admin-border)]"
                >
                  <img
                    src={img.url}
                    alt={img.altText ?? ""}
                    className="h-full w-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pending previews */}
          {pendingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pendingImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--admin-border)]"
                >
                  <img
                    src={img.preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  {img.uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 size={14} className="animate-spin text-white" />
                    </div>
                  ) : (
                    <button
                      onClick={() => removePending(idx)}
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--admin-border)] text-xs text-[var(--admin-text-muted)] transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
          >
            <ImagePlus size={14} />
            Choose images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-xs text-[var(--admin-text-muted)]">
            Images are uploaded when you save the item. First image becomes primary for new items.
          </p>
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
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </span>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Item"
            )}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2.5">
      <div>
        <p className="text-xs font-medium text-[var(--admin-text)]">{label}</p>
        <p className="text-[11px] text-[var(--admin-text-muted)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border)]"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `h-9 w-full rounded-lg border px-3 text-sm text-[var(--admin-text)] bg-[var(--admin-surface)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 transition-colors ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-[var(--admin-border)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]"
  }`;
}
