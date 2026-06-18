import { menuItems } from "@/lib/menu.constant"

export interface InventoryItem {
  id: string
  name: string
  stock: number
  unit: string
  threshold: number
}

// Initialize inventory from menu items with mock stock values
const inventory: InventoryItem[] = menuItems.map((m, idx) => ({
  id: m.id,
  name: m.name,
  stock: 50 - idx * 2, // variable starter stock
  unit: "pcs",
  threshold: 10,
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
  inventory[idx] = { ...inventory[idx], stock }
  return inventory[idx]
}

// Naive parser: decrement stock for menu items found in the order items string.
export function adjustStockFromOrderItems(orderItems: string) {
  if (!orderItems) return
  const text = orderItems.toLowerCase()
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
