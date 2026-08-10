// lib/api/response.ts
import { NextResponse } from "next/server";

export function ok<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function created<T>(data: T, message = "Created successfully") {
  return ok(data, message, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message = "Bad request", errors?: unknown) {
  return NextResponse.json({ success: false, message, errors }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message = "Conflict") {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function serverError(message = "Internal server error", error?: unknown) {
  if (process.env.NODE_ENV === "development") console.error(error);
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export function validationError(errors: unknown) {
  return NextResponse.json(
    { success: false, message: "Validation failed", errors },
    { status: 422 }
  );
}
