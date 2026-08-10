import prisma from "@/lib/prisma/client";
import { calculateCartTotals, getOrCreateCart } from "./cart.service";
import { sendMail, orderConfirmedTemplate, orderStatusTemplate } from "@/lib/mail/mailer";
import { CreateOrderInput } from "@/lib/validators/order";


export async function createOrder(userId: string | null, input: CreateOrderInput) {
  if (!userId) {
  throw new Error("Guest checkout is not implemented yet");
}
  const cart = await getOrCreateCart(userId);
  if (!cart.items || (cart as any).items.length === 0) throw new Error("Cart is empty");

  const { subtotal, discountAmount, deliveryFee, taxAmount, totalAmount, coupon } =
    await calculateCartTotals(cart.id, input.couponCode);

  const orderNumber = `PT${Date.now().toString().slice(-8)}`;

  const order = await prisma.$transaction(async (tx: any) => {
    // Build order items from cart
    const itemsData = await Promise.all(
      (cart as any).items.map(async (ci: any) => {
        const basePrice  = Number(ci.menuItem.basePrice);
        const sizeAddon  = ci.size ? Number(ci.size.priceAddon) : 0;
        const addonTotal = ci.addons.reduce((s: number, a: any) => s + Number(a.addon.price), 0);
        const unitPrice  = basePrice + sizeAddon + addonTotal;
        return {
          menuItemId: ci.menuItemId,
          sizeId:     ci.sizeId,
          quantity:   ci.quantity,
          unitPrice,
          totalPrice: unitPrice * ci.quantity,
          addons: {
            create: ci.addons.map((a: any) => ({ addonId: a.addonId, price: a.addon.price })),
          },
        };
      })
    );

    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        guestName: input.guestName,
guestPhone: input.guestPhone,
guestAddress: input.guestAddress,
        addressId:     input.addressId,
        type:          input.type,
        paymentMethod: input.paymentMethod,
        note:          input.note,
        subtotal,
        discountAmount,
        deliveryFee,
        taxAmount,
        totalAmount,
        couponId:      coupon?.id,
        estimatedTime: "30–45 minutes",
        status:        "PENDING",
        items:         { create: itemsData },
        timeline:      { create: { status: "PENDING", note: "Order received" } },
      },
      include: {
        items: { include: { menuItem: { select: { name:true } }, addons: true } },
        address: true,
        timeline: true,
      },
    });
     console.log("ORDER CREATED:");
console.log({
  guestName: newOrder.guestName,
  guestPhone: newOrder.guestPhone,
  guestAddress: newOrder.guestAddress,
  addressId: newOrder.addressId,
});
    // Increment coupon usage
    if (coupon) {
      await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
     console.log("ORDER CREATED:");
console.log({
  guestName: newOrder.guestName,
  guestPhone: newOrder.guestPhone,
  guestAddress: newOrder.guestAddress,
  addressId: newOrder.addressId,
});
    return newOrder;
  });

  // Send confirmation email (non-blocking)
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      const itemList = order.items.map((i: any) => ({ name: i.menuItem.name, qty: i.quantity }));
      await sendMail({
        to:      user.email,
        subject: `Order Confirmed #${orderNumber} — Pizza Town`,
        html:    orderConfirmedTemplate(orderNumber, Number(totalAmount), itemList),
      });
    }
  } catch { /* email failure should not fail the order */ }

  return order;
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
 const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
});

await prisma.orderTimeline.create({
    data: {
        orderId,
        status,
        note,
    },
});

const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        },
        address: true,
        coupon: true,
        timeline: {
            orderBy: {
                createdAt: "asc",
            },
        },
        items: {
            include: {
                menuItem: {
                    include: {
                        images: true,
                    },
                },
                size: true,
                addons: {
                    include: {
                        addon: true,
                    },
                },
            },
        },
    },
});

return updatedOrder;

  // Send status update email
  try {
    if (order.user?.email) {
      await sendMail({
        to:      order.user.email,
        subject: `Order Update #${order.orderNumber} — Pizza Town`,
        html:    orderStatusTemplate(order.orderNumber, status),
      });
    }
  } catch { /* non-blocking */ }

  return order;
}
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string
) {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus,
      // paidAt:
      //   paymentStatus === "PAID"
      //     ? new Date()
      //     : null,
    },
    include: {
      timeline: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}
