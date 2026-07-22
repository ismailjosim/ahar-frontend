import { z } from "zod"

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Variant name is required").max(50, "Variant name cannot exceed 50 characters"),

  price: z
    .number({
      error: "Variant price must be a number",
    })
    .positive("Variant price must be greater than 0"),
})

const addOnSchema = z.object({
  id: z.string().optional(),

  name: z.string().trim().min(1, "Add-on name is required").max(50, "Add-on name cannot exceed 50 characters"),

  price: z
    .number({
      error: "Add-on price must be a number",
    })
    .nonnegative("Add-on price cannot be negative"),
})

const menuItemSchema = z.object({
  name: z
    .string({
      error: "Menu item name is required",
    })
    .trim()
    .min(2, "Menu item name must be at least 2 characters")
    .max(100, "Menu item name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  // Prisma CUID instead of UUID
  categoryId: z.string().trim().min(1, "Category is required"),

  price: z
    .number({
      error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  rating: z
    .number({
      error: "Rating must be a number",
    })
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot exceed 5")
    .default(0)
    .optional(),

  prepTime: z
    .string()
    .trim()
    .min(2, "Preparation time is required")
    .max(50, "Preparation time cannot exceed 50 characters")
    .optional(),

  tags: z.array(z.string().trim().min(1).max(30)).default([]),

  variants: z.array(variantSchema).default([]),

  addOns: z.array(addOnSchema).default([]),

  isFeatured: z.boolean().default(false),

  isSpicy: z.boolean().default(false),

  isAvailable: z.boolean().default(true),
})

export const createMenuItemZodSchema = menuItemSchema

export const updateMenuItemZodSchema = menuItemSchema.omit({ rating: true })
