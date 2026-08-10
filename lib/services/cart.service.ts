import prisma from "@/lib/prisma/client";

const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 500;

export async function getOrCreateCart(userId: string) {
  console.log("UPSERT USER ID:", userId);
  return prisma.cart.upsert({
    where:  { userId },
    update: {},
    create: { userId },
    include: cartInclude(),
  });
}

export async function calculateCartTotals(cartId: string, couponCode?: string) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude() });
  if (!cart) throw new Error("Cart not found");

  let subtotal = 0;
  for (const item of cart.items as any[]) {
    const basePrice  = Number(item.menuItem.basePrice);
    const sizeAddon  = item.size  ? Number(item.size.priceAddon) : 0;
    const addonTotal = item.addons.reduce((s: number, a: any) => s + Number(a.addon.price), 0);
    subtotal += (basePrice + sizeAddon + addonTotal) * item.quantity;
  }

  let discountAmount = 0;
  let coupon: any = null;
  if (couponCode) {
    coupon = await prisma.coupon.findFirst({
      where: { code: couponCode, isActive: true, expiresAt: { gt: new Date() } },
    });
    if (coupon && subtotal >= Number(coupon.minOrderAmount)) {
      discountAmount = coupon.type === "PERCENTAGE"
        ? Math.floor(subtotal * Number(coupon.value) / 100)
        : Number(coupon.value);
    }
  }

  const afterDiscount = subtotal - discountAmount;
  const deliveryFee   = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : 0;
  const taxAmount     = Math.round(afterDiscount * TAX_RATE);
  const totalAmount   = afterDiscount + deliveryFee + taxAmount;

  return { cart, subtotal, discountAmount, deliveryFee, taxAmount, totalAmount, coupon };
}

function cartInclude() {
  return {
    items: {
      include: {
        menuItem: { select: { id:true, name:true, basePrice:true, images:{ where:{ isPrimary:true }, take:1, select:{ url:true } } } },
        size:     { select: { id:true, label:true, priceAddon:true } },
        addons:   { include: { addon: { select: { id:true, label:true, price:true } } } },
      },
    },
  };
}
