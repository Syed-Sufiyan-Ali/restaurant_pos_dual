// lib/api/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS  = Number(process.env.RATE_LIMIT_WINDOW_MS  ?? 60_000);
const MAX_REQ    = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100);

export function rateLimit(req: NextRequest, max = MAX_REQ): NextResponse | null {
  const ip  = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const now = Date.now();
  const rec = store.get(ip);

  if (!rec || now > rec.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  rec.count++;
  if (rec.count > max) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rec.resetAt - now) / 1000)) } }
    );
  }

  return null;
}
