import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, notFound, forbidden, serverError } from "@/lib/api/response";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const role   = req.headers.get("x-user-role")!;
    const order  = await prisma.order.findUnique({ where:{ id }, select:{ userId:true } });
    if (!order) return notFound("Order not found");
    if (order.userId !== userId && !["ADMIN","SUPER_ADMIN","MANAGER"].includes(role)) return forbidden();
    return ok(await prisma.orderTimeline.findMany({ where:{ orderId:id }, orderBy:{ createdAt:"asc" } }));
  } catch (e) { return serverError("Failed to fetch timeline", e); }
}