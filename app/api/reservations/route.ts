import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { ReservationSchema } from "@/lib/validators/order";
import { ok, created, validationError, serverError, badRequest } from "@/lib/api/response";

// Configurable — seats available per slot
const MAX_PER_SLOT = 4;

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const reservations = await prisma.reservation.findMany({
      where:   { userId },
      orderBy: { date: "desc" },
    });
    return ok(reservations);
  } catch (e) { return serverError("Failed to fetch reservations", e); }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const parsed = ReservationSchema.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

    const { date, time, partySize } = parsed.data;
    const reservationDate = new Date(date);

    // Check slot availability
    const slotCount = await prisma.reservation.count({
      where: { date: reservationDate, time, status: { in: ["PENDING","CONFIRMED"] } },
    });
    if (slotCount >= MAX_PER_SLOT) {
      return badRequest(`Time slot ${time} is fully booked. Please choose another time.`);
    }

    const reservation = await prisma.reservation.create({
      data: { ...parsed.data, userId, date: reservationDate },
    });
    return created(reservation);
  } catch (e) { return serverError("Failed to create reservation", e); }
}
