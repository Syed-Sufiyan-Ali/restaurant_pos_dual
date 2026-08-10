import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma/client";
import { signToken } from "@/lib/auth/jwt";
import { LoginSchema } from "@/lib/validators/auth";
import { ok, unauthorized, validationError, serverError, forbidden } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 20);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized("Invalid email or password");

    if (!user.isActive) return forbidden("Your account has been disabled. Contact support.");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return unauthorized("Invalid email or password");

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });

    return ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatarUrl: user.avatarUrl },
    }, "Login successful");
  } catch (e) {
    return serverError("Login failed", e);
  }
}
