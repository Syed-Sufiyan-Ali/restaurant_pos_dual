import prisma from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { categories } from "@/lib/data";

export async function GET() {
  try {
    let cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    if (!cats || cats.length === 0) {
      cats = categories.map((c, i) => ({
        id: c.id,
        name: c.name,
        slug: c.id,
        description: c.description,
        imageUrl: c.image,
        sortOrder: i,
        isActive: true,
      })) as any;
    }

    return NextResponse.json({
      success: true,
      data: cats,
    });
  } catch (error) {
    console.warn("DB query failed, using fallback categories:", error);
    const fallbackCats = categories.map((c, i) => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      description: c.description,
      imageUrl: c.image,
      sortOrder: i,
      isActive: true,
    }));

    return NextResponse.json({
      success: true,
      data: fallbackCats,
    });
  }
}
