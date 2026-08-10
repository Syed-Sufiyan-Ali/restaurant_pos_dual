import { AUTH_TOKEN_KEY } from "./constants";
import { adminApi } from "./api";
import type { PaginatedResult } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuCategory {
      id: string;
    name: string;
    slug: string;

    description?: string;

    imageUrl?: string;

    sortOrder: number;

    isActive: boolean;

    _count?: {
        menuItems: number;
    };
}

export interface MenuItemImage {
    id: string;
    url: string;
    altText?: string | null;
    isPrimary: boolean;
}

export interface MenuItemSize {
    id: string;
    label: string;
    priceAddon: number;
    serves?: string | null;
    isDefault: boolean;
}

export interface MenuItemAddon {
    id: string;
    label: string;
    price: number | string;
    basePrice: number | string;
    priceAddon: number | string;
  
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  category: MenuCategory;
  categoryId: string;
  images?: MenuItemImage[];
  sizes?: MenuItemSize[];
  addons?: MenuItemAddon[];
  createdAt: string;
  updatedAt: string;
  tag?: string | null;
  ingredients?: Ingredient[];
  _count?: {
    reviews: number;
};
}
export interface Ingredient {
    name: string;
}



// ─── Query Helpers ─────────────────────────────────────────────────────────────

export interface MenuItemsQuery {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
}

function buildQS(query: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function fetchCategories() {
  return adminApi.get<MenuCategory[]>("/api/menu/categories");
}

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export function createCategory(payload: CategoryPayload) {
  return adminApi.post<MenuCategory>("/api/menu/categories", payload);
}

export function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  return adminApi.patch<MenuCategory>(`/api/menu/categories/${id}`, payload);
}

export function deleteCategory(id: string) {
  return adminApi.delete<{ id: string }>(`/api/menu/categories/${id}`);
}

// ─── Menu Items ───────────────────────────────────────────────────────────────

export function fetchMenuItems(query: MenuItemsQuery = {}) {
  return adminApi.get<PaginatedResult<MenuItem>>(`/api/menu/items${buildQS(query)}`);
}

export function fetchMenuItem(id: string) {
  return adminApi.get<MenuItem>(`/api/menu/items/${id}`);
}

export interface MenuItemPayload {
    name: string;

    slug: string;

    description?: string;

    categoryId: string;

    basePrice: number;

    tag?: string;

    sortOrder?: number;

    isAvailable?: boolean;

    isFeatured?: boolean;

    sizes?: {
        label: string;
        priceAddon: number;
        serves?: string;
        isDefault?: boolean;
    }[];

    addons?: {
        label: string;
        price: number;
    }[];

    ingredients?: string[];
}

export function createMenuItem(payload: MenuItemPayload) {
  return adminApi.post<MenuItem>("/api/menu/items", payload);
}

export function updateMenuItem(id: string, payload: Partial<MenuItemPayload>) {
  return adminApi.patch<MenuItem>(`/api/menu/items/${id}`, payload);
}

export function deleteMenuItem(id: string) {
  return adminApi.delete<{ id: string }>(`/api/menu/items/${id}`);
}

export function toggleMenuItemAvailable(id: string, isAvailable: boolean) {
  return adminApi.patch<MenuItem>(`/api/menu/items/${id}`, { isAvailable });
}

export function toggleMenuItemFeatured(id: string, isFeatured: boolean) {
  return adminApi.patch<MenuItem>(`/api/menu/items/${id}`, { isFeatured });
}

// ─── Images ───────────────────────────────────────────────────────────────────

export async function uploadMenuItemImage(
  itemId: string,
  file: File,
  isPrimary?: boolean
): Promise<{ success: boolean; data?: MenuItemImage; message?: string }> {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;

  const formData = new FormData();
  formData.append("file", file);
  if (isPrimary !== undefined) formData.append("isPrimary", String(isPrimary));

  try {
    const res = await fetch(`/api/menu/items/${itemId}/images`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    return json;
  } catch {
    return { success: false, message: "Image upload failed." };
  }
}
