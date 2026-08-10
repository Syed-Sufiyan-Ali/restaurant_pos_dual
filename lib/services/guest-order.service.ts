import prisma from "@/lib/prisma/client";
import { GuestOrderInput } from "@/lib/validators/guest-orders";

export async function createGuestOrder(input: GuestOrderInput) {
  const orderNumber = `PT${Date.now().toString().slice(-8)}`;

  let subtotal = 0;

  for (const item of input.items) {
    subtotal += item.sizePrice * item.quantity;

    for (const extra of item.extras) {
      subtotal += extra.price * item.quantity;
    }
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,

      guestName: input.guestName,
      guestPhone: input.guestPhone,
      guestAddress: input.guestAddress,

      paymentMethod: input.paymentMethod,
      note: input.note,

      subtotal,
      totalAmount: subtotal,
      discountAmount: 0,
      deliveryFee: 0,
      taxAmount: 0,

      estimatedTime: "30-45 Minutes",

      status: "PENDING",

      items: {
        create: input.items.map((item) => ({
          menuItemId: item.productId,

          quantity: item.quantity,

          unitPrice: item.sizePrice,

          totalPrice: item.sizePrice * item.quantity,

          addons: {
            create: item.extras.map((extra) => ({
              addonId: extra.id,
              price: extra.price,
            })),
          },
        })),
      },

      timeline: {
        create: {
          status: "PENDING",
          note: "Guest order placed",
        },
      },
    },

    include: {
      items: true,
      timeline: true,
    },
  });

  return order;
}