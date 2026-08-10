import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, notFound, forbidden, serverError } from "@/lib/api/response";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const role   = req.headers.get("x-user-role")!;
    const order  = await prisma.order.findUnique({
      where:{ orderNumber: id },
      include:{ items:{ include:{ menuItem:{ select:{ name:true, images:{ where:{ isPrimary:true }, take:1, select:{ url:true } } } }, size:true, addons:{ include:{ addon:{ select:{ label:true, price:true } } } } } }, address:true, timeline:{ orderBy:{ createdAt:"asc" } }, coupon:{ select:{ code:true, type:true, value:true } } },
    });
    if (!order) return notFound("Order not found");
    console.log("LOGGED IN TRACK ORDER");
console.log({
  guestName: order.guestName,
  guestPhone: order.guestPhone,
  guestAddress: order.guestAddress,
  address: order.address,
});
    if (order.userId !== userId && !["ADMIN","SUPER_ADMIN","MANAGER"].includes(role)) return forbidden();
    return ok({
  id: order.orderNumber,
  orderNumber: order.orderNumber,

  status: order.status.toLowerCase().replace(/_/g, ""),

  subtotal: Number(order.subtotal),
  deliveryFee: Number(order.deliveryFee),
  taxAmount: Number(order.taxAmount),
  totalAmount: Number(order.totalAmount),

  estimatedTime: order.estimatedTime,
  paymentMethod: order.paymentMethod,

  phone: order.guestPhone,

  address:
    order.address
      ? `${order.address.street}, ${order.address.area}, ${order.address.city}`
      : order.guestAddress,

  items: order.items.map((item: any) => ({
    id: item.id,

    menuItem: {
      name: item.menuItem.name,
    },

    size: item.size,

    quantity: item.quantity,

    totalPrice: Number(item.totalPrice),
  })),

  timeline: order.timeline,
});
  } catch (e) {
  console.error("ORDER FETCH ERROR:", e);
  return serverError("Failed to fetch order", e);
}
}