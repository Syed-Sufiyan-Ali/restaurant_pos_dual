import { NextRequest } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma/client";
import { sendMail, passwordResetTemplate } from "@/lib/mail/mailer";
import { ForgotPasswordSchema } from "@/lib/validators/auth";
import { ok, validationError, serverError } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) return ok(null, "If that email exists, a reset link has been sent.");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendMail({ to: email, subject: "Reset Your Password — Pizza Town", html: passwordResetTemplate(user.name, resetUrl) });

    return ok(null, "If that email exists, a reset link has been sent.");
  } catch (e) {
    return serverError("Failed to process request", e);
  }
}
