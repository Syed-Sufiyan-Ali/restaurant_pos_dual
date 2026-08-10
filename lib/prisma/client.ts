// lib/prisma/client.ts
// Note: Run `npx prisma generate` after setup to enable full Prisma client

let prisma: any;

try {
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as any;
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query","error","warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch {
  // Prisma client not generated yet — run: npx prisma generate
  console.warn("Prisma client not generated. Run: npx prisma generate");
  prisma = {};
}

export default prisma;
