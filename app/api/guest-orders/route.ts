import { NextRequest } from "next/server";
import { GuestOrderSchema } from "@/lib/validators/guest-orders";
import { createGuestOrder } from "@/lib/services/guest-order.service";
import {
  created,
  validationError,
  serverError,
} from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const parsed = GuestOrderSchema.safeParse(await req.json());

    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors);
    }

    const order = await createGuestOrder(parsed.data);

    return created(order);
  } catch (e) {
    return serverError("Failed to place guest order", e);
  }
}