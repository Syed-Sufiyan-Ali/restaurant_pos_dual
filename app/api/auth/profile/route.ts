import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { UpdateProfileSchema } from "@/lib/validators/auth";
import { ok, validationError, serverError, notFound } from "@/lib/api/response";

// GET /api/auth/profile
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id:true, name:true, email:true, phone:true, role:true, avatarUrl:true, isVerified:true, createdAt:true, addresses:true },
    });
    if (!user) return notFound("User not found");
    return ok(user);
  } catch (e) {
    return serverError("Failed to fetch profile", e);
  }
}

// PATCH /api/auth/profile
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const user = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: { id:true, name:true, email:true, phone:true, role:true, avatarUrl:true },
    });
    return ok(user, "Profile updated successfully");
  } catch (e) {
    return serverError("Failed to update profile", e);
  }
}
