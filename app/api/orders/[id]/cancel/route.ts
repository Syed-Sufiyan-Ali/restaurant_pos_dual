import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { updateOrderStatus } from "@/lib/services/order.service";
import { ok, notFound, forbidden, badRequest, serverError } from "@/lib/api/response";
type Ctx = { params: Promise<{ id: string }> };
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const order  = await prisma.order.findUnique({ where:{ id } });
    if (!order) return notFound("Order not found");
    if (order.userId !== userId) return forbidden();
    if (["DELIVERED","CANCELLED"].includes(order.status)) return badRequest(`Cannot cancel — status: ${order.status}`);
    if (order.status === "ON_THE_WAY") return badRequest("Order is on the way");
    return ok(await updateOrderStatus(id, "CANCELLED", "Cancelled by customer"), "Order cancelled");
  } catch (e) { return serverError("Failed to cancel order", e); }
}