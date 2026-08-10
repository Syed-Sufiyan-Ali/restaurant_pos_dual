import { NextRequest } from "next/server";
import { z } from "zod";

import { updateOrderStatus } from "@/lib/services/order.service";
import { ok, validationError, serverError } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
type Ctx = { params: Promise<{ id: string }> };
const S = z.object({ status: z.enum(["PENDING","CONFIRMED","PREPARING","ON_THE_WAY","DELIVERED","CANCELLED"]), note: z.string().max(200).optional() });
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } =  await requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const parsed = S.safeParse(await req.json());
    if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);
    return ok(await updateOrderStatus(id, parsed.data.status, parsed.data.note), "Status updated");
  } catch (e) { return serverError("Failed to update status", e); }
}