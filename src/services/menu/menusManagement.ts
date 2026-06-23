"use server"

import { revalidatePath } from "next/cache"
import type {
  Allergen,
  MenuItem,
  MenuItemListResponse,
  MenuItemResponse,
  MenuAddOn,
  MenuVariant,
} from "@/types/menu.interface"

// ─── types ────────────────────────────────────────────────────────────────────

type ActionState = {
  success: boolean
  message: string
  formData?: Record<string, unknown>
  errors?: Partial<Record<string, string>>
} | null

export interface GetAllMenuParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseVariants(value: string): MenuVariant[] {
  return parseList(value).map((item) => {
    const [name, markup = "0"] = item.split(":")
    return { name: name.trim(), markup: Number(markup) || 0 }
  })
}

function parseAddOns(value: string): MenuAddOn[] {
  return parseList(value).map((item) => {
    const [name, price = "0"] = item.split(":")
    return { name: name.trim(), price: Number(price) || 0 }
  })
}

function extractFormData(formData: FormData) {
  // Core identity
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string

  // Pricing
  const price = Number(formData.get("price")) || 0
  const discountPrice = formData.get("discountPrice") ? Number(formData.get("discountPrice")) : undefined
  const discountPercent = formData.get("discountPercent") ? Number(formData.get("discountPercent")) : undefined

  // Media & display
  const emoji = formData.get("emoji") as string
  const sortOrder = Number(formData.get("sortOrder")) || 0
  const file = formData.get("file") as File | null

  // Nutrition & prep
  const prepTime = formData.get("prepTime") as string
  const calories = formData.get("calories") ? Number(formData.get("calories")) : undefined
  const protein = formData.get("protein") ? Number(formData.get("protein")) : undefined
  const carbs = formData.get("carbs") ? Number(formData.get("carbs")) : undefined

  // Dietary flags
  const isHalal = formData.get("isHalal") === "on"
  const isVegetarian = formData.get("isVegetarian") === "on"
  const isVegan = formData.get("isVegan") === "on"
  const isGlutenFree = formData.get("isGlutenFree") === "on"
  const isSpicy = formData.get("isSpicy") === "on"

  // Allergens (multi-value checkbox — getAll not get)
  const allergens = formData.getAll("allergens") as Allergen[]

  // Customization
  const tags = parseList((formData.get("tags") as string) || "")
  const variants = parseVariants((formData.get("variants") as string) || "")
  const addOns = parseAddOns((formData.get("addOns") as string) || "")

  // Status
  const isFeatured = formData.get("isFeatured") === "on"
  const isAvailable = formData.get("isAvailable") === "on"
  const stockStatus = (formData.get("stockStatus") as string) || "in_stock"

  return {
    name,
    category,
    description,
    price,
    discountPrice,
    discountPercent,
    emoji,
    sortOrder,
    file,
    prepTime,
    calories,
    protein,
    carbs,
    isHalal,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isSpicy,
    allergens,
    tags,
    variants,
    addOns,
    isFeatured,
    isAvailable,
    stockStatus,
  }
}

function validate(fields: ReturnType<typeof extractFormData>) {
  const errors: Partial<Record<string, string>> = {}

  if (!fields.name?.trim()) {
    errors.name = "Item name is required."
  } else if (fields.name.trim().length > 120) {
    errors.name = "Name must be 120 characters or less."
  }

  if (!fields.category || fields.category === "All Dishes") {
    errors.category = "Please select a specific category."
  }

  if (!fields.price || fields.price <= 0) {
    errors.price = "Price must be greater than ৳0."
  } else if (fields.price > 99999) {
    errors.price = "Price seems too high — maximum is ৳99,999."
  }

  if (fields.discountPrice && fields.discountPrice >= fields.price) {
    errors.discountPrice = "Discount price must be less than the base price."
  }

  if (fields.discountPercent !== undefined && (fields.discountPercent < 0 || fields.discountPercent > 100)) {
    errors.discountPercent = "Discount percent must be between 0 and 100."
  }

  return errors
}

function buildPayload(fields: ReturnType<typeof extractFormData>) {
  return {
    name: fields.name.trim(),
    category: fields.category,
    description: fields.description?.trim() || "",
    price: fields.price,
    discountPrice: fields.discountPrice,
    discountPercent: fields.discountPercent,
    sortOrder: fields.sortOrder,
    prepTime: fields.prepTime?.trim() || "25 min",
    nutrition: {
      calories: fields.calories,
      protein: fields.protein,
      carbs: fields.carbs,
    },
    isHalal: fields.isHalal,
    isVegetarian: fields.isVegetarian,
    isVegan: fields.isVegan,
    isGlutenFree: fields.isGlutenFree,
    isSpicy: fields.isSpicy,
    allergens: fields.allergens,
    tags: fields.tags,
    variants: fields.variants,
    addOns: fields.addOns,
    isFeatured: fields.isFeatured,
    isAvailable: fields.isAvailable,
    stockStatus: fields.stockStatus,
  }
}

// ─── image upload helper ──────────────────────────────────────────────────────

async function uploadImage(menuItemId: string, file: File): Promise<void> {
  const fd = new FormData()
  fd.append("image", file)
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuItemId}/image`, {
    method: "POST",
    body: fd,
  })
}

// ─── getAllMenuItems ───────────────────────────────────────────────────────────

export async function getAllMenuItems(params: GetAllMenuParams = {}): Promise<MenuItemListResponse> {
  const { page = 1, pageSize = 20, search, category } = params

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(search && { search }),
    ...(category && { category }),
  })

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?${query}`, { cache: "no-store" })

    if (!res.ok) {
      return { success: false, data: [], total: 0, page, pageSize }
    }

    return res.json()
  } catch {
    return { success: false, data: [], total: 0, page, pageSize }
  }
}

// ─── getMenuItemById ──────────────────────────────────────────────────────────

export async function getMenuItemById(id: string): Promise<MenuItemResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, { cache: "no-store" })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        success: false,
        data: null as unknown as MenuItem,
        message: body?.message ?? "Menu item not found.",
      }
    }

    return body
  } catch {
    return {
      success: false,
      data: null as unknown as MenuItem,
      message: "Something went wrong. Please try again.",
    }
  }
}

// ─── createMenuItem ───────────────────────────────────────────────────────────

export async function createMenuItem(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const fields = extractFormData(formData)
  const errors = validate(fields)

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below.",
      formData: { ...fields, file: undefined },
      errors,
    }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(fields)),
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        success: false,
        message: body?.message ?? body?.error ?? "Failed to create menu item.",
        formData: { ...fields, file: undefined },
      }
    }

    const savedId = body?.data?.id ?? body?.id
    if (fields.file && fields.file.size > 0 && savedId) {
      await uploadImage(savedId, fields.file)
    }

    revalidatePath("/dashboard/menu")

    return {
      success: true,
      message: "Menu item created successfully.",
    }
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      formData: { ...fields, file: undefined },
    }
  }
}

// ─── updateMenuItem ───────────────────────────────────────────────────────────

export async function updateMenuItem(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const fields = extractFormData(formData)
  const errors = validate(fields)

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below.",
      formData: { ...fields, file: undefined },
      errors,
    }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(fields)),
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        success: false,
        message: body?.message ?? body?.error ?? "Failed to update menu item.",
        formData: { ...fields, file: undefined },
      }
    }

    if (fields.file && fields.file.size > 0) {
      await uploadImage(id, fields.file)
    }

    revalidatePath("/dashboard/menu")

    return {
      success: true,
      message: "Menu item updated successfully.",
    }
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      formData: { ...fields, file: undefined },
    }
  }
}

// ─── deleteMenuItem ───────────────────────────────────────────────────────────

export async function deleteMenuItem(id: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
      method: "DELETE",
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        success: false,
        message: body?.message ?? body?.error ?? "Failed to delete menu item.",
      }
    }

    revalidatePath("/dashboard/menu")

    return {
      success: true,
      message: "Menu item deleted successfully.",
    }
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
