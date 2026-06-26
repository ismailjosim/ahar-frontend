import { z } from "zod"

// ======================================================
// SHARED SUB-SCHEMAS
// ======================================================

// z.instanceof(File) breaks in Next.js server actions because the Node.js
// runtime's File global is not the same reference as the browser File.
// We validate the file manually in the server action instead (see service).
const nutritionSchema = z
  .object({
    calories: z.number({ error: "Calories must be a number" }).min(0, "Calories cannot be negative").optional(),
    protein: z.number({ error: "Protein must be a number" }).min(0, "Protein cannot be negative").optional(),
    carbs: z.number({ error: "Carbs must be a number" }).min(0, "Carbs cannot be negative").optional(),
    fat: z.number({ error: "Fat must be a number" }).min(0, "Fat cannot be negative").optional(),
  })
  .optional()
  .transform((val) => {
    // If every nutrition field is undefined, collapse the object to undefined
    // so the backend doesn't receive an empty {} in the JSON body.
    if (!val) return undefined
    const hasValue = Object.values(val).some((v) => v !== undefined)
    return hasValue ? val : undefined
  })

const variantSchema = z
  .array(
    z.object({
      name: z.string({ error: "Variant name must be a string" }).min(1, "Variant name is required"),
      markup: z.number({ error: "Variant markup must be a number" }).min(0, "Markup cannot be negative"),
      sortOrder: z
        .number({ error: "Variant sort order must be a number" })
        .int("Sort order must be a whole number")
        .min(0, "Sort order cannot be negative")
        .default(0),
    }),
  )
  .default([])

const addOnSchema = z
  .array(
    z.object({
      name: z.string({ error: "Add-on name must be a string" }).min(1, "Add-on name is required"),
      price: z.number({ error: "Add-on price must be a number" }).min(0, "Add-on price cannot be negative"),
      isAvailable: z.boolean().default(true),
    }),
  )
  .default([])

const coreFields = {
  // Core Identity
  name: z
    .string({ error: (issue) => (issue.input === undefined ? "Item name is required" : "Item name must be a string") })
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must be at most 100 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug must be at most 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only")
    .optional(),

  category: z
    .string({ error: (issue) => (issue.input === undefined ? "Category is required" : "Category must be a string") })
    .min(1, "Please select a category"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    // Treat empty string as undefined so the DB doesn't store ""
    .transform((val) => (val === "" ? undefined : val)),

  // Pricing
  price: z
    .number({ error: (issue) => (issue.input === undefined ? "Price is required" : "Price must be a number") })
    .min(1, "Price must be at least 1")
    .max(99999, "Price must be at most 99999"),

  discountPrice: z
    .number({ error: "Discount price must be a number" })
    .min(0, "Discount price cannot be negative")
    .max(99999, "Discount price must be at most 99999")
    .optional(),

  discountPercent: z
    .number({ error: "Discount percent must be a number" })
    .min(0, "Discount percent cannot be negative")
    .max(100, "Discount percent cannot exceed 100")
    .optional(),

  // Media & Display
  sortOrder: z
    .number({ error: "Sort order must be a number" })
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative")
    .default(0),

  // Nutrition & Prep
  prepTime: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  nutrition: nutritionSchema,

  // Dietary flags
  isHalal: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isSpicy: z.boolean().default(false),

  // Allergens & Tags
  allergens: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // Variants & Add-ons
  variants: variantSchema,
  addOns: addOnSchema,

  // Discovery & Status
  stockStatus: z
    .enum(["in_stock", "limited", "out_of_stock"], { error: "Please select a valid stock status" })
    .default("in_stock"),

  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
}

// ======================================================
// CREATE MENU ITEM SCHEMA
// imageUrl is intentionally excluded — file validation is
// done manually in the server action before building FormData,
// because z.instanceof(File) fails in the Node.js server context.
// ======================================================

export const createMenuItemZodSchema = z.object(coreFields)

// ======================================================
// UPDATE MENU ITEM SCHEMA
// Same exclusion of imageUrl — handled via hasNewImage check.
// ======================================================

export const updateMenuItemZodSchema = z.object(coreFields)

// ======================================================
// INFERRED TYPES
// ======================================================

export type TCreateMenuItem = z.infer<typeof createMenuItemZodSchema>
export type TUpdateMenuItem = z.infer<typeof updateMenuItemZodSchema>
