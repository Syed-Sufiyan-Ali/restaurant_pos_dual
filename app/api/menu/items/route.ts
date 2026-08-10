import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { MenuItemSchema } from "@/lib/validators/menu";
import { ok, created, validationError, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
import { products } from "@/lib/data";

const itemSelect = {
  id: true, name: true, slug: true, description: true, basePrice: true,
  isAvailable: true, isFeatured: true, tag: true, sortOrder: true,
  category: { select: { id: true, name: true, slug: true } },
  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
  sizes: true,
  addons: true,
  ingredients: { select: { name: true } },
  _count: { select: { reviews: true } },
};

function getFallbackItems(categoryFilter?: string | null, searchQuery?: string | null, featuredOnly?: boolean) {
  let list = products;
  if (categoryFilter) {
    list = list.filter((p) => p.category === categoryFilter);
  }
  if (featuredOnly) {
    list = list.filter((p) => p.tag === "bestseller" || p.tag === "new");
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  return list.map((p, idx) => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    description: p.description,
    basePrice: p.basePrice,
    isAvailable: true,
    isFeatured: p.tag === "bestseller",
    tag: p.tag || null,
    sortOrder: idx,
    category: {
      id: p.category,
      name: p.category.charAt(0).toUpperCase() + p.category.slice(1),
      slug: p.category,
    },
    images: [{ url: p.image }],
    sizes: (p.sizes || []).map((s, sIdx) => ({
      id: `${p.id}-s-${sIdx}`,
      label: s.label,
      priceAddon: s.price,
      serves: s.serves,
    })),
    addons: (p.extras || []).map((e) => ({
      id: e.id,
      label: e.label,
      price: e.price,
    })),
    ingredients: (p.ingredients || []).map((ing) => ({ name: ing })),
    _count: { reviews: 12 },
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category  = searchParams.get("category");
  const search    = searchParams.get("search");
  const featured  = searchParams.get("featured") === "true";
  const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit     = Math.min(50, Number(searchParams.get("limit") ?? 20));

  try {
    const where: any = { isAvailable: true };
    if (category) where.category = { slug: category };
    if (featured) where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let items: any[] = [];
    let total = 0;

    try {
      [items, total] = await Promise.all([
        prisma.menuItem.findMany({
          where,
          select: itemSelect,
          orderBy: { sortOrder: "asc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.menuItem.count({ where }),
      ]);
    } catch (dbErr) {
      console.warn("Prisma query failed, falling back to static products data:", dbErr);
    }

    if (!items || items.length === 0) {
      const fallbackList = getFallbackItems(category, search, featured);
      total = fallbackList.length;
      items = fallbackList.slice((page - 1) * limit, page * limit);
    }

    return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    console.error("GET /api/menu/items error:", e);
    const fallbackList = getFallbackItems(category, search, featured);
    const total = fallbackList.length;
    const items = fallbackList.slice((page - 1) * limit, page * limit);
    return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, ["ADMIN", "SUPER_ADMIN", "MANAGER"]);
  if (error) return error;
  try {
    const body = await req.json();
    const parsed = MenuItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { sizes, addons, ingredients, ...data } = parsed.data;

    const item = await prisma.menuItem.create({
      data: {
        ...data,
        basePrice: data.basePrice,
        sizes:       sizes       ? { create: sizes }                              : undefined,
        addons:      addons      ? { create: addons }                             : undefined,
        ingredients: ingredients ? { create: ingredients.map((n) => ({ name: n })) } : undefined,
      },
      select: itemSelect,
    });
    return created(item);
  } catch (e) { return serverError("Failed to create menu item", e); }
}
