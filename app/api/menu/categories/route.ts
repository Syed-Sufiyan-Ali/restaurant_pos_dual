// import { NextRequest } from "next/server";
// import prisma from "@/lib/prisma/client";
// import { CategorySchema } from "@/lib/validators/menu";
// import { ok, created, validationError, serverError } from "@/lib/api/response";
// import { requireRole } from "@/lib/auth/middleware";

// export async function GET() {
//   try {
//     const cats = await prisma.category.findMany({
//       where: { isActive: true },
//       orderBy: { sortOrder: "asc" },
//       include: { _count: { select: { menuItems: true } } },
//     });
//     return ok(cats);
//   } catch (e) { return serverError("Failed to fetch categories", e); }
// }

// export async function POST(req: NextRequest) {
//   const { user, error } = requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
//   if (error) return error;
//   try {
//     const parsed = CategorySchema.safeParse(await req.json());
//     if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
//     const cat = await prisma.category.create({ data: parsed.data });
//     return created(cat);
//   } catch (e) { return serverError("Failed to create category", e); }
// }
import prisma from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
   const cats = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: cats,
  });
}