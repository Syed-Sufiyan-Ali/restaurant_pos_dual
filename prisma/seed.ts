// prisma/seed.ts

import { PrismaClient, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const existing = await prisma.user.findUnique({ where: { email: "admin@pizzatown.pk" } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name:         "Pizza Town Admin",
        email:        "admin@pizzatown.pk",
        passwordHash: await bcrypt.hash("Admin@123", 12),
        role:         RoleName.SUPER_ADMIN,
        isVerified:   true,
      },
    });
    console.log("✅ Admin user created: admin@pizzatown.pk / Admin@123");
  }

  // Seed categories
  const cats = [
    { name: "Pizzas",  slug: "pizza",   sortOrder: 1 },
    { name: "Burgers", slug: "burgers", sortOrder: 2 },
    { name: "Deals",   slug: "deals",   sortOrder: 3 },
    { name: "Sides",   slug: "sides",   sortOrder: 4 },
    { name: "Drinks",  slug: "drinks",  sortOrder: 5 },
  ];

  for (const cat of cats) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // Seed a coupon
  await prisma.coupon.upsert({
    where:  { code: "PIZZA10" },
    update: {},
    create: {
      code:           "PIZZA10",
      type:           "PERCENTAGE",
      value:          10,
      minOrderAmount: 500,
      isActive:       true,
    },
  });
  console.log("✅ Coupon PIZZA10 seeded");
  // Get categories from database
const dbCategories = await prisma.category.findMany();

const categoryMap = new Map(
  dbCategories.map((category) => [category.slug, category.id])
);

// Seed menu items
for (const product of products) {
  const categoryId = categoryMap.get(product.category);

  if (!categoryId) {
    console.warn(`⚠️ Category not found for ${product.name}`);
    continue;
  }

  await prisma.menuItem.upsert({
    where: {
      slug: product.id,
    },
    update: {},
    create: {
      categoryId,
      name: product.name,
      slug: product.id,
      description: product.description,
      basePrice: product.basePrice,
      isFeatured: product.tag === "bestseller",
      tag: product.tag ?? null,
    },
  });
}

console.log("✅ Menu items seeded");
// Load all menu items from database
const dbMenuItems = await prisma.menuItem.findMany();

const menuItemMap = new Map(
  dbMenuItems.map((item) => [item.slug, item.id])
);
// Seed menu images
for (const product of products) {
  const menuItemId = menuItemMap.get(product.id);

  if (!menuItemId) continue;

  const existingImage = await prisma.menuImage.findFirst({
    where: {
      menuItemId,
      isPrimary: true,
    },
  });

  if (!existingImage) {
    await prisma.menuImage.create({
      data: {
        menuItemId,
        url: product.image,
        cloudinaryId: product.id,
        isPrimary: true,
      },
    });
  }
}
console.log("✅ Menu images seeded");
// Seed sizes
for (const product of products) {
  // Only pizzas have multiple sizes
  if (!product.sizes) continue;

  const menuItemId = menuItemMap.get(product.id);

  if (!menuItemId) continue;

  for (const [index, size] of product.sizes.entries()) {
    const exists = await prisma.size.findFirst({
      where: {
        menuItemId,
        label: size.label,
      },
    });

    if (!exists) {
      await prisma.size.create({
        data: {
          menuItemId,
          label: size.label,
          priceAddon: size.price,
          serves: size.serves,
          isDefault: index === 0,
        },
      });
    }
  }
}

console.log("✅ Sizes seeded");
// Seed ingredients
for (const product of products) {
  if (!product.ingredients) continue;

  const menuItemId = menuItemMap.get(product.id);

  if (!menuItemId) continue;

  for (const ingredient of product.ingredients) {
    const exists = await prisma.ingredient.findFirst({
      where: {
        menuItemId,
        name: ingredient,
      },
    });

    if (!exists) {
      await prisma.ingredient.create({
        data: {
          menuItemId,
          name: ingredient,
        },
      });
    }
  }
}

console.log("✅ Ingredients seeded");
// Seed addons
for (const product of products) {
  const extras = product.extras ?? [];

  if (extras.length === 0) continue;

  const menuItemId = menuItemMap.get(product.id);

  if (!menuItemId) continue;

  for (const extra of extras) {
    const exists = await prisma.addon.findFirst({
      where: {
        menuItemId,
        label: extra.label,
      },
    });

    if (!exists) {
      await prisma.addon.create({
        data: {
          menuItemId,
          label: extra.label,
          price: extra.price,
        },
      });
    }
  }
}

console.log("✅ Addons seeded");
  console.log("🎉 Seed complete!");
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
