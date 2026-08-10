import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

console.log("🔥 ADMIN ORDER ROUTE HIT 🔥");
export async function GET(req: NextRequest) {
  const { user, error } = await requireRole(req, [
    "ADMIN",
    "SUPER_ADMIN",
    "MANAGER",
]);

if (error) return error;
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit  = 20;

    const where: any = {};

if (status)
  where.status = status;

if (search) {
  where.OR = [
    {
      orderNumber: {
        contains: search,
      },
    },
    {
      guestName: {
        contains: search,
       
      },
    },
    {
      guestPhone: {
        contains: search,
        
      },
    },
    {
      user: {
        name: {
          contains: search,
         
        },
      },
    },
  ];
}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, orderBy: { createdAt:"desc" }, skip:(page-1)*limit, take:limit,
        include: {
          user:    { select:{ name:true, email:true, phone:true } },
          address: true,
          items:   { include:{ menuItem:{ select:{ name:true } } } },
          timeline: { orderBy:{ createdAt:"asc" } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return ok({ orders, total, page, totalPages: Math.ceil(total/limit) });
  } catch (e) { return serverError("Failed to fetch orders", e); }
}
