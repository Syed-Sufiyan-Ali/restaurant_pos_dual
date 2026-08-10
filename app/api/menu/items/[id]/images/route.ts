import { NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { uploadImage, deleteImage } from "@/lib/cloudinary/upload";
import { ok, created, badRequest, serverError, noContent } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/middleware";
type Ctx = { params: Promise<{ id: string }> };
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const { base64, isPrimary = false } = await req.json();
    if (!base64) return badRequest("base64 image data is required");
    if (isPrimary) await prisma.menuImage.updateMany({ where:{ menuItemId:id }, data:{ isPrimary:false } });
    const { url, publicId } = await uploadImage(base64, "pizzatown/menu");
    return created(await prisma.menuImage.create({ data:{ menuItemId:id, url, cloudinaryId:publicId, isPrimary } }));
  } catch (e) { return serverError("Failed to upload image", e); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  await params;
  const { error } = requireRole(req, ["ADMIN","SUPER_ADMIN","MANAGER"]);
  if (error) return error;
  try {
    const { imageId } = await req.json();
    const img = await prisma.menuImage.findUnique({ where:{ id:imageId } });
    if (!img) return noContent();
    await deleteImage(img.cloudinaryId);
    await prisma.menuImage.delete({ where:{ id:imageId } });
    return noContent();
  } catch (e) { return serverError("Failed to delete image", e); }
}