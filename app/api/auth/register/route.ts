import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma/client";
import { signToken } from "@/lib/auth/jwt";
import { RegisterSchema } from "@/lib/validators/auth";
import { ok, conflict, validationError, serverError } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { name, email, phone, password } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return conflict("An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    return ok({ user, token }, "Account created successfully", 201);
  } catch (e) {
    return serverError("Registration failed", e);
  }
}
