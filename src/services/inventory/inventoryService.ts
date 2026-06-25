import { z } from "zod"
import { serverFetch } from "@/lib/server-fetch"
import { zodValidator } from "@/lib/zodValidator"
import { normalizeServerError, type IActionState } from "@/lib/normalizeServerError"
import type { InventoryItem } from "@/lib/inventory.store"

// ======================================================
//* VALIDATION SCHEMA
// ======================================================
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name cannot exceed 120 characters"),
  category: z.string().min(1, "Category is required"),
  sku: z.string().optional().default(""),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  unit: z.string().min(1, "Unit is required"),
  threshold: z.coerce.number().min(0, "Threshold must be 0 or greater"),
  supplier: z.string().optional().default(""),
  unitCost: z.coerce.number().min(0, "Unit cost must be 0 or greater"),
  lastRestocked: z.string().optional().default(""),
})

export type InventoryItemInput = z.infer<typeof inventoryItemSchema>

// ======================================================
//* API CALLS & SERVICES
// ======================================================

/**
 * Fetch all inventory items
 */
export const getInventoryItems = async (): Promise<{ success: boolean; data?: InventoryItem[]; message?: string }> => {
  try {
    const response = await serverFetch.get("/inventory")
    const result = await response.json()
    if (!response.ok) {
      return { success: false, message: result?.message || "Failed to fetch inventory items" }
    }
    return { success: true, data: result.data || [] }
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    return { success: false, message: "Network error fetching inventory items" }
  }
}

/**
 * Create a new inventory item
 */
export const createInventoryItem = async (payload: unknown): Promise<IActionState> => {
  const validation = zodValidator(payload, inventoryItemSchema)
  if (!validation.success) {
    const errorMap: Record<string, string> = {}
    validation.errors.forEach((err) => {
      errorMap[err.field] = err.message
    })
    return {
      success: false,
      message: "Please fix validation errors.",
      errors: errorMap,
    }
  }

  try {
    const response = await serverFetch.post("/inventory", {
      body: JSON.stringify(validation.data),
    })
    const result = await response.json()

    if (!response.ok) {
      return normalizeServerError(result)
    }

    return {
      success: true,
      message: "Inventory item created successfully.",
    }
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return { success: false, message: "Network error occurred." }
  }
}

/**
 * Update an existing inventory item
 */
export const updateInventoryItem = async (id: string, payload: unknown): Promise<IActionState> => {
  const validation = zodValidator(payload, inventoryItemSchema)
  if (!validation.success) {
    const errorMap: Record<string, string> = {}
    validation.errors.forEach((err) => {
      errorMap[err.field] = err.message
    })
    return {
      success: false,
      message: "Please fix validation errors.",
      errors: errorMap,
    }
  }

  try {
    const response = await serverFetch.patch(`/inventory/${id}`, {
      body: JSON.stringify(validation.data),
    })
    const result = await response.json()

    if (!response.ok) {
      return normalizeServerError(result)
    }

    return {
      success: true,
      message: "Inventory item updated successfully.",
    }
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return { success: false, message: "Network error occurred." }
  }
}

/**
 * Update stock count for a single item
 */
export const updateInventoryStock = async (id: string, stock: number): Promise<IActionState> => {
  try {
    const response = await serverFetch.patch(`/inventory/${id}`, {
      body: JSON.stringify({ stock }),
    })
    const result = await response.json()

    if (!response.ok) {
      return normalizeServerError(result)
    }

    return {
      success: true,
      message: "Stock updated successfully.",
    }
  } catch (error) {
    console.error("Error updating stock:", error)
    return { success: false, message: "Network error updating stock." }
  }
}

/**
 * Delete an inventory item
 */
export const deleteInventoryItem = async (id: string): Promise<IActionState> => {
  try {
    const response = await serverFetch.delete(`/inventory/${id}`)
    const result = await response.json()

    if (!response.ok) {
      return normalizeServerError(result)
    }

    return {
      success: true,
      message: "Inventory item deleted successfully.",
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return { success: false, message: "Network error deleting item." }
  }
}
