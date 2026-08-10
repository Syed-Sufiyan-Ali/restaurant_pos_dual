import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/middleware";
import { ok, badRequest, notFound, serverError } from "@/lib/api/response";
import { updateOrderStatus } from "@/lib/services/order.service";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireRole(req, [
    "ADMIN",
    "SUPER_ADMIN",
    "MANAGER",
]);

if (error) return error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("status" in body)
  ) {
    return badRequest("Missing required field: status.");
  }

  const { status } = body as { status: unknown };

  if (!isValidStatus(status)) {
    return badRequest(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}.`
    );
  }

  try {
    const updatedOrder = await updateOrderStatus(id, status);

    if (!updatedOrder) return notFound("Order not found.");

    return ok(updatedOrder);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update order status.";
    console.error("[PATCH /api/admin/orders/:id/status]", err);
    return serverError(message);
  }
}
