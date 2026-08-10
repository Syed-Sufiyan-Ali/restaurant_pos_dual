import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { CategorySchema } from "@/lib/validators/menu";
import { ok, notFound, validationError, serverError, noContent } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) return notFound("Category not found");
    return ok(cat);
  } catch (e) { return serverError("Failed to fetch category", e); }
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const parsed = CategorySchema.partial().safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    return ok(await prisma.category.update({ where: { id }, data: parsed.data }), "Updated");
  } catch (e) { return serverError("Failed to update category", e); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN"]);
  if (error) return error;
  try {
    await prisma.category.delete({ where: { id } });
    return noContent();
  } catch (e) { return serverError("Failed to delete category", e); }
}