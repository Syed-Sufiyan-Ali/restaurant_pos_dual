import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, unauthorized, serverError , validationError} from "@/lib/api/response";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return unauthorized("Login required");
    }

    const token = auth.split(" ")[1];
    const payload = await verifyToken(token);
    console.log("PROFILE ROUTE VERSION 2");
    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return unauthorized("User not found");
    }

    return ok({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      totalOrders: user.orders.length,
    });
  } catch (e) {
    return serverError("Unable to load profile", e);
  }
}
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+92|03)\d{9}$/, "Enter a valid Pakistani phone number")
    .optional()
    .or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return unauthorized("Login required");
    }

    const token = auth.split(" ")[1];
    const payload =  await verifyToken(token);

    const body = await req.json();

    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors);
    }

    const user = await prisma.user.update({
      where: {
        id: payload.sub,
      },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return ok(user);

  } catch (e) {
    return serverError("Unable to update profile", e);
  }
}