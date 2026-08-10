// lib/auth/middleware.ts
import { NextRequest } from "next/server";
import { verifyToken, AppJWTPayload } from "./jwt";
import { unauthorized, forbidden } from "@/lib/api/response";


export type AuthedRequest = NextRequest & { user: AppJWTPayload };

/**
 * Extracts and verifies JWT from Authorization header.
 * Returns the payload or a NextResponse error.
 */
export async function getAuthUser(
  req: NextRequest
): Promise<AppJWTPayload | null> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Use inside route handlers:
 *   const { user, error } = requireAuth(req);
 *   if (error) return error;
 */
export async function requireAuth(
  req: NextRequest
): Promise<
  | { user: AppJWTPayload; error: null }
  | { user: null; error: ReturnType<typeof unauthorized> }
> {
  const user = await getAuthUser(req);

  if (!user) {
    return {
      user: null,
      error: unauthorized(),
    };
  }

  return {
    user,
    error: null,
  };
}

/**
 * Require specific roles:
 *   const { user, error } = requireRole(req, ["ADMIN", "MANAGER"]);
 */
export async function requireRole(
  req: NextRequest,
  roles: string[]
): Promise<
  | { user: AppJWTPayload; error: null }
  | {
      user: null;
      error: ReturnType<typeof unauthorized> | ReturnType<typeof forbidden>;
    }
> {
  const { user, error } = await requireAuth(req);

  if (error) {
    return { user: null, error };
  }

  if (!roles.includes(user.role)) {
    return {
      user: null,
      error: forbidden("You do not have permission to access this resource"),
    };
  }

  return {
    user,
    error: null,
  };
}
