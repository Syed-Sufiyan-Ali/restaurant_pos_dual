// lib/validators/order.ts
import { z } from "zod";

export const AddToCartSchema = z.object({
  menuItemId: z.string().cuid(),
  sizeId:     z.string().cuid().optional(),
  addonIds:   z.array(z.string().cuid()).default([]),
  quantity:   z.number().int().min(1).max(20),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(20),
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(1).max(30).toUpperCase(),
});

export const CreateOrderSchema = z.object({
  guestName: z.string().min(2).max(100).optional(),
  guestPhone: z.string().min(10).max(20).optional(),
  guestAddress: z.string().min(5).max(300).optional(),

  addressId: z.string().cuid().optional(),

  type: z.enum(["DELIVERY", "PICKUP"]).default("DELIVERY"),

  paymentMethod: z.enum(["cod", "jazzcash", "easypaisa"]),

  couponCode: z.string().optional(),

  note: z.string().max(300).optional(),
});

export const AddressSchema = z.object({
  label:     z.string().max(30).default("Home"),
  street:    z.string().min(5).max(200),
  area:      z.string().min(2).max(100),
  city:      z.string().default("Sukkur"),
  isDefault: z.boolean().default(false),
});

export const ReservationSchema = z.object({
  name:      z.string().min(2).max(100),
  phone:     z.string().regex(/^(\+92|0)[0-9]{10}$/),
  date:      z.string().datetime(),
  time:      z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  partySize: z.number().int().min(1).max(20),
  note:      z.string().max(300).optional(),
});

export const ReviewSchema = z.object({
  menuItemId: z.string().cuid(),
  rating:     z.number().int().min(1).max(5),
  comment:    z.string().max(500).optional(),
});

export const ContactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(1000),
});

export type AddToCartInput    = z.infer<typeof AddToCartSchema>;
export type CreateOrderInput  = z.infer<typeof CreateOrderSchema>;
export type AddressInput      = z.infer<typeof AddressSchema>;
export type ReservationInput  = z.infer<typeof ReservationSchema>;
export type ReviewInput       = z.infer<typeof ReviewSchema>;
export type ContactInput      = z.infer<typeof ContactSchema>;
