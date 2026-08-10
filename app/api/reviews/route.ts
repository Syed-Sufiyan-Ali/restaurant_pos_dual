import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ReviewSchema } from "@/lib/validators/order";
import { ok, created, validationError, serverError, conflict, badRequest } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get("menuItemId");
    const page  = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 10;

    const where: any = { isApproved: true };
    if (menuItemId) where.menuItemId = menuItemId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where, orderBy: { createdAt: "desc" }, skip: (page-1)*limit, take: limit,
        include: { user: { select: { name:true, avatarUrl:true } }, menuItem: { select: { name:true } } },
      }),
      prisma.review.count({ where }),
    ]);

    // Average rating for menu item
    let avgRating = null;
    if (menuItemId) {
      const agg = await prisma.review.aggregate({ where: { menuItemId, isApproved:true }, _avg: { rating: true }, _count: true });
      avgRating = { avg: agg._avg.rating, count: agg._count };
    }

    return ok({ reviews, total, page, totalPages: Math.ceil(total/limit), avgRating });
  } catch (e) { return serverError("Failed to fetch reviews", e); }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const parsed = ReviewSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    // Must have ordered this item
    const ordered = await prisma.orderItem.findFirst({
      where: { menuItemId: parsed.data.menuItemId, order: { userId, status: "DELIVERED" } },
    });
    if (!ordered) return badRequest("You can only review items you have ordered and received.");

    const existing = await prisma.review.findUnique({
      where: { userId_menuItemId: { userId, menuItemId: parsed.data.menuItemId } },
    });
    if (existing) return conflict("You have already reviewed this item.");

    const review = await prisma.review.create({
      data: { ...parsed.data, userId },
      include: { user: { select: { name:true, avatarUrl:true } } },
    });
    return created(review);
  } catch (e) { return serverError("Failed to submit review", e); }
}
