import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ok, notFound, forbidden, badRequest, serverError } from "@/lib/api/response";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const r = await prisma.reservation.findUnique({ where:{ id } });
    if (!r) return notFound("Reservation not found");
    if (r.userId !== userId) return forbidden();
    return ok(r);
  } catch (e) { return serverError("Failed to fetch reservation", e); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const userId = req.headers.get("x-user-id")!;
    const r = await prisma.reservation.findUnique({ where:{ id } });
    if (!r) return notFound("Reservation not found");
    if (r.userId !== userId) return forbidden();
    if (r.status === "CONFIRMED") return badRequest("Confirmed reservations cannot be cancelled online. Please call us.");
    await prisma.reservation.update({ where:{ id }, data:{ status:"CANCELLED" } });
    return ok(null, "Reservation cancelled");
  } catch (e) { return serverError("Failed to cancel reservation", e); }
}