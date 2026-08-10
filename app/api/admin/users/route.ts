import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN"]);
  if (error) return error;
  try {
    const page  = Math.max(1, Number(new URL(req.url).searchParams.get("page") ?? 1));
    const limit = 20;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id:true, name:true, email:true, phone:true, role:true, isActive:true, isVerified:true, createdAt:true, _count:{ select:{ orders:true } } },
        orderBy: { createdAt:"desc" }, skip:(page-1)*limit, take:limit,
      }),
      prisma.user.count(),
    ]);
    return ok({ users, total, page, totalPages: Math.ceil(total/limit) });
  } catch (e) { return serverError("Failed to fetch users", e); }
}
