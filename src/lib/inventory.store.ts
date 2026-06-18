import { menuItems } from "@/lib/menu.constant"

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string
  stock: number
  unit: string
  threshold: number
  supplier: string
  unitCost: number
  lastRestocked: string
  history: string[]
}

// Initialize inventory from menu items with mock stock values
let inventory: InventoryItem[] = menuItems.map((m, idx) => ({
  id: m.id,
  name: m.name,
  category: m.category,
  sku: `SKU-${String(idx + 1).padStart(3, "0")}`,
  stock: 50 - idx * 2, // variable starter stock
  unit: "pcs",
  threshold: 10,
  supplier: "Ahar Central Supplier",
  unitCost: Math.max(35, Math.round(m.price * 0.35)),
  lastRestocked: "2026-06-18",
  history: ["Initial stock loaded"],
}))

export function listInventory({ page = 1, pageSize = 100 }: { page?: number; pageSize?: number }) {
  const start = (page - 1) * pageSize
  const data = inventory.slice(start, start + pageSize)
  return { data, total: inventory.length }
}

export function getInventoryItem(id: string) {
  return inventory.find((i) => i.id === id) || null
}

export function updateStock(id: string, stock: number) {
  const idx = inventory.findIndex((i) => i.id === id)
  if (idx === -1) return null
  inventory[idx] = {
    ...inventory[idx],
    stock,
    history: [
      `Stock changed to ${stock} ${inventory[idx].unit} at ${new Date().toLocaleString()}`,
      ...inventory[idx].history,
    ],
  }
  return inventory[idx]
}

export function createInventoryItem(payload: Partial<InventoryItem>) {
  const id = payload.id || `INV-${Date.now().toString().slice(-6)}`
  const item: InventoryItem = {
    id,
    name: payload.name || "New Inventory Item",
    category: payload.category || "Kitchen",
    sku: payload.sku || `SKU-${id}`,
    stock: Number(payload.stock || 0),
    unit: payload.unit || "pcs",
    threshold: Number(payload.threshold || 10),
    supplier: payload.supplier || "Unassigned",
    unitCost: Number(payload.unitCost || 0),
    lastRestocked: payload.lastRestocked || new Date().toISOString().slice(0, 10),
    history: payload.history || ["Item created"],
  }
  inventory = [item, ...inventory]
  return item
}

export function updateInventoryItem(id: string, patch: Partial<InventoryItem>) {
  const idx = inventory.findIndex((i) => i.id === id)
  if (idx === -1) return null
  inventory[idx] = {
    ...inventory[idx],
    ...patch,
    stock: patch.stock === undefined ? inventory[idx].stock : Number(patch.stock),
    threshold: patch.threshold === undefined ? inventory[idx].threshold : Number(patch.threshold),
    unitCost: patch.unitCost === undefined ? inventory[idx].unitCost : Number(patch.unitCost),
    history: [`Item details updated at ${new Date().toLocaleString()}`, ...inventory[idx].history],
  }
  return inventory[idx]
}

export function deleteInventoryItem(id: string) {
  const idx = inventory.findIndex((i) => i.id === id)
  if (idx === -1) return false
  inventory.splice(idx, 1)
  return true
}

// Naive parser: decrement stock for menu items found in the order items string.
export function adjustStockFromOrderItems(orderItems: string) {
  if (!orderItems) return
  // find quantity by pattern like 'name x N'
  const parts = orderItems.split(",")
  parts.forEach((part) => {
    const qMatch = part.match(/x\s*(\d+)/i)
    const qty = qMatch ? parseInt(qMatch[1], 10) : 1
    const partNorm = part.toLowerCase()
    // match by menu item name token presence
    for (const menu of menuItems) {
      const menuName = menu.name.toLowerCase()
      if (
        partNorm.includes(menuName) ||
        (menuName.split(" ").slice(0, 2).join(" ") && partNorm.includes(menuName.split(" ").slice(0, 2).join(" ")))
      ) {
        // decrement inventory for this menu.id
        const idx = inventory.findIndex((i) => i.id === menu.id)
        if (idx !== -1) {
          inventory[idx].stock = Math.max(0, inventory[idx].stock - qty)
        }
        break
      }
    }
  })
}

export function lowStockItems() {
  return inventory
    .filter((i) => i.stock <= i.threshold)
    .map((i) => ({
      item: i.name,
      category: "Kitchen",
      stock: `${i.stock} ${i.unit}`,
      severity: i.stock <= 5 ? "critical" : "warning",
    }))
}
