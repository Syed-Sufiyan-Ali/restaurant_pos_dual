// lib/validators/menu.ts
import { z } from "zod";

export const CategorySchema = z.object({
  name:        z.string().min(2).max(60),
  slug:        z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  description: z.string().max(255).optional(),
  sortOrder:   z.number().int().default(0),
  isActive:    z.boolean().default(true),
});

export const MenuItemSchema = z.object({
  categoryId:  z.string().cuid(),
  name:        z.string().min(2).max(120),
  slug:        z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  basePrice:   z.number().positive(),
  isAvailable: z.boolean().default(true),
  isFeatured:  z.boolean().default(false),
  tag:         z.enum(["bestseller","new","spicy","deal"]).optional(),
  sortOrder:   z.number().int().default(0),
  sizes: z.array(z.object({
    label:      z.string(),
    priceAddon: z.number().min(0),
    serves:     z.string().optional(),
    isDefault:  z.boolean().default(false),
  })).optional(),
  addons: z.array(z.object({
    label: z.string(),
    price: z.number().min(0),
  })).optional(),
  ingredients: z.array(z.string()).optional(),
});

export type CategoryInput  = z.infer<typeof CategorySchema>;
export type MenuItemInput   = z.infer<typeof MenuItemSchema>;
