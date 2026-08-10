import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { MenuItemSchema } from "@/lib/validators/menu";
import { ok, created, validationError, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

const itemSelect = {
  id:true, name:true, slug:true, description:true, basePrice:true,
  isAvailable:true, isFeatured:true, tag:true, sortOrder:true,
  category: { select:{ id:true, name:true, slug:true } },
  images:   { where:{ isPrimary:true }, select:{ url:true }, take:1 },
  sizes:    true,
  addons:   true,
  ingredients: { select:{ name:true } },
  _count: { select: { reviews: true } },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get("category");
    const search    = searchParams.get("search");
    const featured  = searchParams.get("featured");
    const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit     = Math.min(50, Number(searchParams.get("limit") ?? 20));

    const where: any = { isAvailable: true };
    if (category) where.category = { slug: category };
    if (featured) where.isFeatured = true;
   if (search) {
  where.OR = [
    {
      name: {
        contains: search,
      },
    },
    {
      description: {
        contains: search,
      },
    },
  ];
}

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({ where, select: itemSelect, orderBy: { sortOrder:"asc" }, skip:(page-1)*limit, take:limit }),
      prisma.menuItem.count({ where }),
    ]);

    return ok({ items, total, page, limit, totalPages: Math.ceil(total/limit) });
  } catch (e) { 
    console.error(e);
    return serverError("Failed to fetch menu items", e); }
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
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
        ingredients: ingredients ? { create: ingredients.map((n) => ({ name:n })) } : undefined,
      },
      select: itemSelect,
    });
    return created(item);
  } catch (e) { return serverError("Failed to create menu item", e); }
}
