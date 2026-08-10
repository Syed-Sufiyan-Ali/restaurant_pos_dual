import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const page  = Math.max(1, Number(new URL(req.url).searchParams.get("page") ?? 1));
    const limit = 20;
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy:{ createdAt:"desc" }, skip:(page-1)*limit, take:limit }),
      prisma.contactMessage.count(),
    ]);
    return ok({ messages, total, page, totalPages: Math.ceil(total/limit) });
  } catch (e) { return serverError("Failed to fetch messages", e); }
}
