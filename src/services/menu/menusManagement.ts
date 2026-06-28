/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

import { serverFetch } from "@/lib/server-fetch"
import { zodValidator } from "@/lib/zodValidator"
import { createMenuItemZodSchema, updateMenuItemZodSchema } from "@/schema/menu.validation"

// ── File validation ───────────────────────────────────────────────────────────
// z.instanceof(File) fails in Next.js server actions because the Node.js
// runtime File global differs from the browser File. We validate manually here
// and return a shaped error that matches zodValidator's response so the form
// can display it via <InputFieldError field="file" />.

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

function validateFile(file: File | null, required: boolean) {
  if (!file || file.size === 0) {
    if (required) {
      return {
        success: false as const,
        message: "Validation failed",
        errors: [{ field: "file", message: "Please upload an image" }],
      }
    }
    return null // not required and not provided — fine
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false as const,
      message: "Validation failed",
      errors: [{ field: "file", message: "Only JPEG, PNG, WebP, or GIF images are allowed" }],
    }
  }

  return null // valid
}

// ── Shared payload builder ────────────────────────────────────────────────────

function buildPayload(formData: FormData) {
  const variantsRaw = formData.get("variants") as string
  const addOnsRaw = formData.get("addOns") as string
  const tagsRaw = formData.get("tags") as string
  const allergensRaw = formData.getAll("allergens") as string[]

  return {
    // Core Identity
    name: formData.get("name") as string,
    slug: (formData.get("slug") as string) || undefined,
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || undefined,

    // Pricing
    price: Number(formData.get("price")),
    discountPrice: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : undefined,
    discountPercent: formData.get("discountPercent") ? Number(formData.get("discountPercent")) : undefined,

    // Media & Display (imageUrl excluded — validated + sent separately)
    sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,

    // Nutrition & Prep
    prepTime: (formData.get("prepTime") as string) || undefined,
    nutrition: {
      calories: formData.get("calories") ? Number(formData.get("calories")) : undefined,
      protein: formData.get("protein") ? Number(formData.get("protein")) : undefined,
      carbs: formData.get("carbs") ? Number(formData.get("carbs")) : undefined,
      fat: formData.get("fat") ? Number(formData.get("fat")) : undefined,
    },

    // Dietary flags
    isHalal: formData.get("isHalal") === "on",
    isVegetarian: formData.get("isVegetarian") === "on",
    isVegan: formData.get("isVegan") === "on",
    isGlutenFree: formData.get("isGlutenFree") === "on",
    isSpicy: formData.get("isSpicy") === "on",

    // Allergens & Tags
    allergens: allergensRaw,
    tags: tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],

    // Variants — parsed from "Name:markup:sortOrder" comma string
    variants: variantsRaw
      ? variantsRaw
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => {
            const [name, markup, sortOrder] = v.split(":").map((s) => s.trim())
            return {
              name,
              markup: Number(markup) || 0,
              sortOrder: Number(sortOrder) || 0,
            }
          })
      : [],

    // Add-ons — parsed from "Name:price" comma string
    addOns: addOnsRaw
      ? addOnsRaw
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
          .map((a) => {
            const [name, price] = a.split(":").map((s) => s.trim())
            return {
              name,
              price: Number(price) || 0,
              isAvailable: true,
            }
          })
      : [],

    // Discovery & Status
    stockStatus: formData.get("stockStatus") as string,
    isFeatured: formData.get("isFeatured") === "on",
    isAvailable: formData.get("isAvailable") === "on",
  }
}

// ======================================================
//* CREATE MENU ITEM
// ======================================================

export async function createMenuItem(_prevState: any, formData: FormData) {
  try {
    // 1. Validate file manually (required on create)
    const file = formData.get("file") as File | null
    const fileError = validateFile(file, true)
    if (fileError) return fileError

    // 2. Validate the rest with Zod (imageUrl excluded from schema)
    const payload = buildPayload(formData)
    const validation = zodValidator(payload, createMenuItemZodSchema)
    if (!validation.success) return validation

    // 3. Build multipart FormData for the backend
    const newFormData = new FormData()
    newFormData.append("data", JSON.stringify(validation.data))
    newFormData.append("file", file as Blob)

    // see the form data

    for (let [key, value] of newFormData.entries()) {
      console.log(key, value)
    }

    const res = await serverFetch.post("/menu/create", { body: newFormData })
    const data = await res.json()
    console.log("data", data)
    return data
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to create menu item. Please try again.",
    }
  }
}

// ======================================================
// GET ALL MENU ITEMS
// ======================================================

export async function getMenuItems(queryString?: string) {
  try {
    const res = await serverFetch.get(`/menu${queryString ? `?${queryString}` : ""}`)
    return await res.json()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong!",
    }
  }
}

// ======================================================
// GET MENU ITEM BY ID
// ======================================================

export async function getMenuItemById(id: string) {
  try {
    const res = await serverFetch.get(`/menu/${id}`)
    return await res.json()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong!",
    }
  }
}

// ======================================================
// UPDATE MENU ITEM
// ======================================================

export async function updateMenuItem(id: string, _prevState: any, formData: FormData) {
  try {
    // 1. Validate file manually (optional on update)
    const file = formData.get("file") as File | null
    const fileError = validateFile(file, false)
    if (fileError) return fileError

    // 2. Validate the rest with Zod
    const payload = buildPayload(formData)
    const validation = zodValidator(payload, updateMenuItemZodSchema)
    if (!validation.success) return validation

    // 3a. New image — send as multipart
    const hasNewImage = !!file?.size
    if (hasNewImage) {
      const newFormData = new FormData()
      newFormData.append("data", JSON.stringify(validation.data))
      newFormData.append("file", file as Blob)

      const res = await serverFetch.patch(`/menu/${id}`, { body: newFormData })
      return await res.json()
    }

    // 3b. No new image — send as JSON
    const res = await serverFetch.patch(`/menu/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    })
    return await res.json()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to update menu item. Please try again.",
    }
  }
}

// ======================================================
// SOFT DELETE MENU ITEM
// ======================================================

export async function softDeleteMenuItem(id: string) {
  try {
    const res = await serverFetch.delete(`/menu/soft/${id}`)
    return await res.json()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong!",
    }
  }
}

// ======================================================
// HARD DELETE MENU ITEM
// ======================================================

export async function deleteMenuItem(id: string) {
  try {
    const res = await serverFetch.delete(`/menu/${id}`)
    return await res.json()
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong!",
    }
  }
}
