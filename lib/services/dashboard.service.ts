// import prisma from "@/lib/prisma/client";
// import type { DashboardStats } from "@/lib/admin/types";

// function todayRange(): { gte: Date; lt: Date } {
//   const now = new Date();
//   const gte = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
//   const lt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
//   return { gte, lt };
// }

// export async function getDashboardStats(): Promise<DashboardStats> {
//   const today = todayRange();

//   const [
//     revenueResult,
//     todayOrders,
//     pendingOrders,
//     preparingOrders,
//     deliveredToday,
//   ] = await Promise.all([
//     // Sum revenue from orders delivered today
//     prisma.order.aggregate({
//       _sum: { totalAmount: true },
//       where: {
//         status: "DELIVERED",
//         createdAt: today,
//       },
//     }),

//     // Count all orders placed today
//     prisma.order.count({
//       where: { createdAt: today },
//     }),

//     // Count pending orders (all time)
//     prisma.order.count({
//       where: { status: "PENDING" },
//     }),

//     // Count preparing orders (all time)
//     prisma.order.count({
//       where: { status: "PREPARING" },
//     }),

//     // Count orders delivered today
//     prisma.order.count({
//       where: {
//         status: "DELIVERED",
//         createdAt: today,
//       },
//     }),
//   ]);

//   return {
//     todayRevenue: Number(revenueResult._sum.totalAmount ?? 0),
//     todayOrders,
//     pendingOrders,
//     preparingOrders,
//     deliveredToday,
//   };
// }
