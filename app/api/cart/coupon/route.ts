import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ApplyCouponSchema } from "@/lib/validators/order";
import { ok, badRequest, validationError, serverError } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const parsed = ApplyCouponSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const coupon = await prisma.coupon.findFirst({
      where: {
        code:     parsed.data.code,
        isActive: true,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          { OR: [{ maxUses: null },   { maxUses:   { gt: prisma.coupon.fields.usedCount } }] },
        ],
      },
    });

    if (!coupon) return badRequest("Invalid or expired coupon code");

    return ok({
      code:           coupon.code,
      type:           coupon.type,
      value:          coupon.value,
      minOrderAmount: coupon.minOrderAmount,
    }, "Coupon is valid!");
  } catch (e) { return serverError("Failed to validate coupon", e); }
}
