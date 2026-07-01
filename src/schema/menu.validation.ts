import { z } from 'zod'

// Variant schema for menu item variants
const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().positive('Variant price must be positive'),
})

// Add-on schema for menu item add-ons
const addOnSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Add-on name is required'),
  price: z.number().nonnegative('Add-on price cannot be negative'),
})

const menuItemSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Menu item name is required'
          : 'Menu item name must be a string',
    })
    .trim()
    .min(2, {
      error: 'Menu item name must be at least 2 characters',
    })
    .max(100, {
      error: 'Menu item name cannot exceed 100 characters',
    }),
  description: z
    .string()
    .trim()
    .max(1000, {
      error: 'Description cannot exceed 1000 characters',
    })
    .optional(),
  categoryId: z.string().uuid({
    error: 'Valid category is required',
  }),
  price: z
    .number({
      error: 'Price must be a number',
    })
    .positive({
      error: 'Price must be greater than 0',
    }),
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot exceed 5')
    .optional()
    .nullable(),
  prepTime: z
    .string()
    .trim()
    .max(50, {
      error: 'Prep time cannot exceed 50 characters',
    })
    .optional(),
  tags: z
    .array(z.string().trim().min(1))
    .default([])
    .optional(),
  variants: z
    .array(variantSchema)
    .default([])
    .optional(),
  addOns: z
    .array(addOnSchema)
    .default([])
    .optional(),
  isFeatured: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

export const createMenuItemZodSchema = menuItemSchema

export const updateMenuItemZodSchema = menuItemSchema