import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, notFound, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const msg = await prisma.contactMessage.findUnique({ where:{ id } });
    if (!msg) return notFound("Message not found");
    return ok(await prisma.contactMessage.update({ where:{ id }, data:{ isRead:true } }), "Marked as read");
  } catch (e) { return serverError("Failed to update message", e); }
}