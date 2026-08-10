import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        items: {
          include: {
            menuItem: true,
            size: true,
          },
        },
        timeline: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }
    console.log("GUEST TRACK ORDER");
console.log({
  guestName: order.guestName,
  guestPhone: order.guestPhone,
  guestAddress: order.guestAddress,
});
    return NextResponse.json({
  success: true,
  data: {
    id: order.orderNumber,

    status: order.status.toLowerCase().replace(/_/g, "") as
      | "confirmed"
      | "preparing"
      | "ontheway"
      | "delivered",

    total: Number(order.totalAmount),

    estimatedTime: order.estimatedTime ?? "30–45 mins",

    paymentMethod: order.paymentMethod,

    address: order.guestAddress,

    phone: order.guestPhone,

    items: order.items.map((item: any) => ({
      id: item.id,
      name: item.menuItem.name,
      size: item.size?.label ?? "Regular",
      quantity: item.quantity,
      totalPrice: Number(item.totalPrice),
    })),
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}