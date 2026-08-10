import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { AddressSchema } from "@/lib/validators/order";
import { ok, notFound, forbidden, validationError, serverError, noContent } from "@/lib/api/response";
type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return notFound("Address not found");
    if (address.userId !== userId) return forbidden();
    const parsed = AddressSchema.partial().safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    if (parsed.data.isDefault) await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const updated = await prisma.address.update({ where: { id }, data: parsed.data });
    return ok(updated, "Address updated");
  } catch (e) { return serverError("Failed to update address", e); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return notFound("Address not found");
    if (address.userId !== userId) return forbidden();
    await prisma.address.delete({ where: { id } });
    return noContent();
  } catch (e) { return serverError("Failed to delete address", e); }
}