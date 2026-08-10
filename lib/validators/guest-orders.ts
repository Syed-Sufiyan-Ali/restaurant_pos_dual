import { z } from "zod";

export const GuestOrderSchema = z.object({
  guestName: z.string().min(2).max(100),

  guestPhone: z.string().regex(/^(\+92|0)[0-9]{10}$/),

  guestAddress: z.string().min(5).max(300),

  paymentMethod: z.enum([
    "cod",
    "jazzcash",
    "easypaisa",
    "card",
  ]),

  note: z.string().max(300).optional(),

  items: z.array(
    z.object({
      productId: z.string(),

      quantity: z.number().int().min(1),

      size: z.string(),

      sizePrice: z.number(),

      extras: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          price: z.number(),
        })
      ),
    })
  ).min(1),
});

export type GuestOrderInput = z.infer<typeof GuestOrderSchema>;