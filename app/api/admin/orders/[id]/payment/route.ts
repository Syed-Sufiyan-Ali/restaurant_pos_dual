import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/middleware";
import { ok, badRequest, notFound, serverError } from "@/lib/api/response";
import { updateOrderPaymentStatus } from "@/lib/services/order.service";

const VALID_PAYMENT_STATUSES = [
  "FAILED",
  "PAID",
  "REFUNDED",
] as const;

type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

function isValidPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    typeof value === "string" &&
    (VALID_PAYMENT_STATUSES as readonly string[]).includes(value)
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(req, [
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
    !("paymentStatus" in body)
  ) {
    return badRequest("Missing required field: paymentStatus.");
  }

  const { paymentStatus } = body as {
    paymentStatus: unknown;
  };

  if (!isValidPaymentStatus(paymentStatus)) {
    return badRequest(
      `Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`
    );
  }

  try {
    console.log("Updating payment:", {
  id,
  paymentStatus,
});
console.log("ID:", id);
console.log("PAYMENT STATUS:", paymentStatus);
console.log("Calling service...");
const order = await updateOrderPaymentStatus(id, paymentStatus);
console.log("Service returned:", order);

console.log("Updated order:", order);

    if (!order) return notFound("Order not found.");

    return ok(order);
  }  catch (err) {
  console.error("PAYMENT ERROR:", err);
  return serverError(
    err instanceof Error ? err.message : "Unknown payment error"
  );
}
}
// import { NextResponse } from "next/server";

// export async function PATCH() {
//   console.log("🔥🔥🔥 PAYMENT ROUTE HIT 🔥🔥🔥");

//   return NextResponse.json({
//     success: true,
//     message: "Payment route reached successfully",
//   });
// }