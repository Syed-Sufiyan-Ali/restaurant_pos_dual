import { NextRequest } from "next/server";
import { getOrCreateCart, calculateCartTotals } from "@/lib/services/cart.service";
import { AddToCartSchema } from "@/lib/validators/order";
import { ok, validationError, serverError } from "@/lib/api/response";
import prisma from "@/lib/prisma/client";

// GET /api/cart
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    console.log("ROUTE RECEIVED x-user-id:", userId);
    const couponCode = new URL(req.url).searchParams.get("coupon") ?? undefined;
    const { cart, ...totals } = await calculateCartTotals((await getOrCreateCart(userId)).id, couponCode);
    return ok({ cart, ...totals });
  } catch (e) { return serverError("Failed to fetch cart", e); }
}

// POST /api/cart  — add item
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    console.log("ROUTE RECEIVED x-user-id:", userId);
    const parsed = AddToCartSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { menuItemId, sizeId, addonIds, quantity } = parsed.data;
    const cart = await getOrCreateCart(userId);

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuItemId,
        sizeId,
        quantity,
        addons: addonIds.length ? { create: addonIds.map((addonId) => ({ addonId })) } : undefined,
      },
      include: {
        menuItem: { select: { name:true, basePrice:true } },
        size:     true,
        addons:   { include: { addon: true } },
      },
    });

    return ok(cartItem, "Item added to cart");
  } catch (e) { return serverError("Failed to add to cart", e); }
}

// DELETE /api/cart  — clear cart
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    console.log("ROUTE RECEIVED x-user-id:", userId);
    const cart = await getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return ok(null, "Cart cleared");
  } catch (e) { return serverError("Failed to clear cart", e); }
}
