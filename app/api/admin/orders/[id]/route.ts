import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/middleware";
import prisma from "@/lib/prisma/client";
import { ok, notFound, serverError } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireRole(req, [
    "ADMIN",
    "SUPER_ADMIN",
    "MANAGER",
]);

if (error) return error;

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: {
      select: {
    id: true,
    label: true,
    street: true,
    area: true,
    city: true,
    isDefault: true,
          },
        },
        coupon: {
           select: {
    id: true,
    code: true,
    type: true,
    value: true,
          },
        },
        timeline: {
          orderBy: { createdAt: "asc" },
          select: {
            status: true,
            createdAt: true,
            note: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                images: {
                  where: { isPrimary: true },
  select: {
    id: true,
    url: true,
    isPrimary: true,
  },
  take: 1,
                },
              },
            },
            size: {
               select: {
    id: true,
    label: true,
    serves: true,
    priceAddon: true,
  },
            },
           addons: {
  include: {
    addon: {
      select: {
        label: true,
      },
    },
  },
},
          },
        },
      },
    });

    if (!order) return notFound("Order not found.");
    console.log("ORDER SENT TO FRONTEND");
console.log(order.paymentStatus);
console.log(order);
return ok({
  ...order,
  paymentStatus: order.paymentStatus,
  paidAt: order.paidAt,
});
    return ok(order);
  } catch (err) {
    console.error("[GET /api/admin/orders/:id]", err);
    return serverError("Failed to fetch order.");
  }
}
