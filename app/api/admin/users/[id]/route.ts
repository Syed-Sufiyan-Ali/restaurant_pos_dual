import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { z } from "zod";
import { ok, validationError, serverError, notFound } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

type Ctx = { params: Promise<{ id: string }> };
const S = z.object({ isActive: z.boolean().optional(), role: z.enum(["SUPER_ADMIN","ADMIN","MANAGER","CUSTOMER"]).optional() });
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN"]);
  if (error) return error;
  try {
    const parsed = S.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    const user = await prisma.user.findUnique({ where:{ id } });
    if (!user) return notFound("User not found");
    return ok(await prisma.user.update({ where:{ id }, data: parsed.data, select:{ id:true, name:true, email:true, role:true, isActive:true } }), "User updated");
  } catch (e) { return serverError("Failed to update user", e); }
}