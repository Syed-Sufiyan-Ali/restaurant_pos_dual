import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const today = new Date(); today.setHours(0,0,0,0);

   const [
  totalOrders,
  todayOrders,
  totalRevenue,
  todayRevenue,
  totalUsers,
  pendingOrders,
  totalMenuItems,
  pendingReservations,
  recentOrders,
  preparingOrders,
  deliveredToday,
] = await Promise.all([
  prisma.order.count(),

  prisma.order.count({
    where: { createdAt: { gte: today } },
  }),

  prisma.order.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { totalAmount: true },
  }),

  prisma.order.aggregate({
    where: {
      createdAt: { gte: today },
      paymentStatus: "PAID",
    },
    _sum: { totalAmount: true },
  }),

  prisma.user.count({
    where: { role: "CUSTOMER" },
  }),

  prisma.order.count({
    where: {
      status: {
        in: ["PENDING", "CONFIRMED", "PREPARING"],
      },
    },
  }),

  prisma.menuItem.count({
    where: { isAvailable: true },
  }),

  prisma.reservation.count({
    where: {
      status: "PENDING",
      date: { gte: today },
    },
  }),

  prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  }),

  prisma.order.count({
    where: {
      status: "PREPARING",
    },
  }),

  prisma.order.count({
    where: {
      status: "DELIVERED",
      createdAt: {
        gte: today,
      },
    },
  }),
]);

    return ok({
      stats: {
         totalOrders,
  todayOrders,
  totalRevenue: totalRevenue._sum.totalAmount ?? 0,
  todayRevenue: todayRevenue._sum.totalAmount ?? 0,

  totalCustomers: totalUsers,

  pendingOrders,
  preparingOrders,
  deliveredToday,

  reservationsToday: pendingReservations,
      },
      recentOrders,
    });
  } catch (e) { return serverError("Failed to fetch dashboard stats", e); }
}
