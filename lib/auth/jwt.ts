import { SignJWT, jwtVerify, JWTPayload } from "jose";

export interface AppJWTPayload extends JWTPayload {
  sub: string;
  email: string;
  role: string;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: AppJWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AppJWTPayload> {
  const { payload } = await jwtVerify(token, secret);

  return payload as unknown as AppJWTPayload;
}

export function decodeToken() {
  return null;
}