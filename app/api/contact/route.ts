import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ContactSchema } from "@/lib/validators/order";
import { sendMail } from "@/lib/mail/mailer";
import { ok, validationError, serverError } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5);
  if (limited) return limited;
  try {
    const parsed = ContactSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const msg = await prisma.contactMessage.create({ data: parsed.data });

    // Notify admin
    await sendMail({
      to:      process.env.SMTP_USER!,
      subject: `New Contact: ${parsed.data.subject}`,
      html:    `<p><b>From:</b> ${parsed.data.name} (${parsed.data.email})</p><p><b>Phone:</b> ${parsed.data.phone ?? "N/A"}</p><p><b>Message:</b><br>${parsed.data.message}</p>`,
    }).catch(() => {});

    return ok(msg, "Message sent successfully. We will get back to you soon.");
  } catch (e) { return serverError("Failed to send message", e); }
}
