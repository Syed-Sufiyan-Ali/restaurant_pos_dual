// lib/mail/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  to:      string;
  subject: string;
  html:    string;
}

export async function sendMail({ to, subject, html }: MailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

// ── Templates ────────────────────────────────────────────────────────────────
export function passwordResetTemplate(name: string, resetUrl: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#EF4444">Pizza Town Sukkur 🍕</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>You requested a password reset. Click the button below (valid for 1 hour):</p>
      <a href="${resetUrl}" style="display:inline-block;background:#EF4444;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
        Reset Password
      </a>
      <p style="color:#666;font-size:13px">If you didn't request this, ignore this email.</p>
    </div>`;
}

export function orderConfirmedTemplate(orderNumber: string, total: number, items: { name: string; qty: number }[]) {
  const itemList = items.map((i) => `<li>${i.qty}× ${i.name}</li>`).join("");
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#EF4444">Order Confirmed! 🎉</h2>
      <p>Your order <strong>#${orderNumber}</strong> has been received.</p>
      <ul>${itemList}</ul>
      <p><strong>Total: Rs. ${total.toLocaleString()}</strong></p>
      <p>Estimated delivery: <strong>30–45 minutes</strong></p>
      <p style="color:#666;font-size:13px">Call us: 0331-5633133</p>
    </div>`;
}

export function orderStatusTemplate(orderNumber: string, status: string) {
  const statusMessages: Record<string, string> = {
    CONFIRMED:   "✅ Your order has been confirmed!",
    PREPARING:   "👨‍🍳 Our chefs are preparing your order.",
    ON_THE_WAY:  "🛵 Your order is on the way!",
    DELIVERED:   "🎉 Your order has been delivered. Enjoy!",
    CANCELLED:   "❌ Your order has been cancelled.",
  };
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#EF4444">Order Update 🍕</h2>
      <p>Order <strong>#${orderNumber}</strong></p>
      <p style="font-size:18px">${statusMessages[status] ?? status}</p>
      <p style="color:#666;font-size:13px">Questions? Call: 0331-5633133</p>
    </div>`;
}
