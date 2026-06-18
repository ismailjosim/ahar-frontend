import type { MenuItem } from "@/types/menu.interface"
import { menuItems as initialMenuItems } from "@/lib/menu.constant"

let items: MenuItem[] = [...initialMenuItems]

function generateId(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString().slice(-4)
  )
}

export function listMenu({
  page = 1,
  pageSize = 20,
  category,
  search,
}: {
  page?: number
  pageSize?: number
  category?: string
  search?: string
}) {
  let filtered = items.slice()
  if (category && category !== "all") filtered = filtered.filter((m) => m.category === category)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)
  return { data, total }
}

export function getMenuItem(id: string) {
  return items.find((i) => i.id === id) || null
}

export function createMenuItem(payload: Partial<MenuItem>) {
  const id = payload.id || (payload.name ? generateId(payload.name) : generateId("item"))
  const newItem: MenuItem = {
    id,
    name: payload.name || "New Item",
    description: payload.description || "",
    category: payload.category || "All Dishes",
    price: payload.price || 0,
    emoji: payload.emoji || "🍽",
    rating: payload.rating || 0,
    prepTime: payload.prepTime || "-",
    isFeatured: !!payload.isFeatured,
    isSpicy: !!payload.isSpicy,
    isAvailable: payload.isAvailable !== undefined ? !!payload.isAvailable : true,
    tags: payload.tags || [],
    variants: payload.variants || [],
    addOns: payload.addOns || [],
  }
  items = [newItem, ...items]
  return newItem
}

export function updateMenuItem(id: string, patch: Partial<MenuItem>) {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return null
  items[idx] = { ...items[idx], ...patch }
  return items[idx]
}

export function deleteMenuItem(id: string) {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return false
  items.splice(idx, 1)
  return true
}
