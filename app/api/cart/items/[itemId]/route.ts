import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { UpdateCartItemSchema } from "@/lib/validators/order";
import { ok, notFound, validationError, serverError, noContent } from "@/lib/api/response";
type Ctx = { params: Promise<{ itemId: string }> };
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { itemId } = await params;
  try {
    const parsed = UpdateCartItemSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    const { quantity } = parsed.data;
    if (quantity === 0) { await prisma.cartItem.delete({ where:{ id:itemId } }); return ok(null, "Item removed"); }
    return ok(await prisma.cartItem.update({ where:{ id:itemId }, data:{ quantity } }), "Cart updated");
  } catch (e) { return serverError("Failed to update cart item", e); }
}
export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { itemId } = await params;
  try {
    const exists = await prisma.cartItem.findUnique({ where:{ id:itemId } });
    if (!exists) return notFound("Cart item not found");
    await prisma.cartItem.delete({ where:{ id:itemId } });
    return noContent();
  } catch (e) { return serverError("Failed to remove cart item", e); }
}