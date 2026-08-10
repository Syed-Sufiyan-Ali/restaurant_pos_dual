import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { MenuItemSchema } from "@/lib/validators/menu";
import { ok, notFound, validationError, serverError, noContent } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const item = await prisma.menuItem.findFirst({
      where: { OR:[{ id },{ slug:id }] },
      include: { category:true, images:true, sizes:true, addons:true, toppings:true, ingredients:true,
        reviews:{ where:{ isApproved:true }, include:{ user:{ select:{ name:true, avatarUrl:true } } }, orderBy:{ createdAt:"desc" }, take:10 },
        _count:{ select:{ reviews:true } } },
    });
    if (!item) return notFound("Menu item not found");
    return ok(item);
  } catch (e) { return serverError("Failed to fetch item", e); }
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const parsed = MenuItemSchema.partial().safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    const { sizes, addons, ingredients, ...data } = parsed.data;
    return ok(await prisma.menuItem.update({ where:{ id }, data }), "Item updated");
  } catch (e) { return serverError("Failed to update item", e); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN"]);
  if (error) return error;
  try { await prisma.menuItem.delete({ where:{ id } }); return noContent(); }
  catch (e) { return serverError("Failed to delete item", e); }
}