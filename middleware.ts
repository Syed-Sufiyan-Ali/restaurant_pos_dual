// middleware.ts  (Next.js root middleware)
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// Routes that require authentication
const PROTECTED_API = [
  "/api/auth/profile",
  "/api/cart",
  "/api/reviews",
  "/api/addresses",
  "/api/orders",
];

// Routes only ADMIN / SUPER_ADMIN can access
const ADMIN_API = ["/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_API.some((p) => pathname.startsWith(p));
  const isAdmin     = ADMIN_API.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAdmin) return NextResponse.next();
 
   console.log("PATH:", pathname);
   console.log("AUTH HEADER:", req.headers.get("authorization"));
   console.log("ALL HEADERS:", Object.fromEntries(req.headers.entries()));  

  const header = req.headers.get("authorization") ?? "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    console.log("JWT PAYLOAD:", payload);
    console.log("JWT SUB:", payload.sub);

    if (isAdmin && !["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(payload.role)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Pass user info via headers to route handlers
    const headers = new Headers(req.headers);
    headers.set("x-user-id",   payload.sub);
    headers.set("x-user-email",payload.email);
    headers.set("x-user-role", payload.role);
    console.log("SETTING x-user-id:", payload.sub);
    return NextResponse.next({ request: { headers } });
  } catch (err) {
  console.error("VERIFY ERROR:", err);

  return NextResponse.json(
    {
      success: false,
      message: "Invalid or expired token",
    },
    {
      status: 401,
    }
  );
}
}

export const config = {
  matcher: ["/api/:path*"],
};
