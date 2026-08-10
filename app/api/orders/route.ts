import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { createOrder } from "@/lib/services/order.service";
import { CreateOrderSchema } from "@/lib/validators/order";
import { ok, created, validationError, serverError, badRequest } from "@/lib/api/response";

const orderInclude = {
  items: { include: { menuItem: { select:{ name:true, images:{ where:{ isPrimary:true }, take:1, select:{ url:true } } } }, size:true, addons: { include:{ addon:{ select:{ label:true } } } } } },
  address: true,
  timeline: { orderBy: { createdAt: "asc" as const } },
  coupon:   { select: { code:true, type:true, value:true } },
};

// GET /api/orders — user order history
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const page   = Math.max(1, Number(new URL(req.url).searchParams.get("page") ?? 1));
    const limit  = 10;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where:{ userId }, include: orderInclude, orderBy:{ createdAt:"desc" }, skip:(page-1)*limit, take:limit }),
      prisma.order.count({ where:{ userId } }),
    ]);

    return ok({ items: orders,
    total,
    page,
    limit,
    totalPages
: Math.ceil(total/limit) });
  } catch (e) { return serverError("Failed to fetch orders", e); }
}

// POST /api/orders — place order
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") ?? null;
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const order = await createOrder(userId, parsed.data);
    return created(order);
  } catch (e: any) {
    if (e.message === "Cart is empty") return badRequest("Your cart is empty");
    return serverError("Failed to place order", e);
  }
}
