import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { AddressSchema } from "@/lib/validators/order";
import { ok, created, validationError, serverError } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault:"desc" } });
    return ok(addresses);
  } catch (e) { return serverError("Failed to fetch addresses", e); }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const parsed = AddressSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    if (parsed.data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({ data: { ...parsed.data, userId } });
    return created(address);
  } catch (e) { return serverError("Failed to create address", e); }
}
