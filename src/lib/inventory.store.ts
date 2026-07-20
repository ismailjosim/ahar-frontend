// import { menuItems } from "@/lib/menu.constant"
import { InventoryItem } from "@/types/inventory.interface"

// Match the relation name and structure of the schema
const menuItems = [
  {
    id: "1",
    name: "Ahar Special Biryani",
    category: {
      name: "Rice",
    },
    sku: "SKU-001",
    stock: 10,
    unit: "pcs",
    threshold: 5,
    supplier: "Supplier A",
    price: 100,
    lastRestocked: new Date(),
    audits: [
      {
        id: "1",
        itemId: "1",
        details: "Item created",
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Initialize inventory from menu items with mock stock values
let inventory: InventoryItem[] = menuItems.map((m, idx) => {
  const itemId = m.id
  return {
    id: itemId,
    name: m.name,
    category: m.category?.name || "Uncategorized",
    sku: `SKU-${String(idx + 1).padStart(3, "0")}`,
    stock: 50 - idx * 2,
    unit: "pcs",
    threshold: 10,
    supplier: "Ahar Central Supplier",
    unitCost: Math.max(35, Math.round(m.price * 0.35)),
    lastRestocked: new Date("2026-06-18"),
    audits: [
      {
        id: `AUD-INIT-${idx}`,
        itemId: itemId,
        details: "Initial stock loaded",
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

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
    updatedAt: new Date(),
    audits: [
      {
        id: `AUD-${Date.now().toString().slice(-6)}`,
        itemId: id,
        details: `Stock changed to ${stock} ${inventory[idx].unit}`,
        createdAt: new Date(),
      },
      ...inventory[idx].audits,
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
    sku: payload.sku || null,
    stock: Number(payload.stock || 0),
    unit: payload.unit || "pcs",
    threshold: Number(payload.threshold || 10),
    supplier: payload.supplier || null,
    unitCost: Number(payload.unitCost || 0),
    lastRestocked: payload.lastRestocked ? new Date(payload.lastRestocked) : null,
    audits: payload.audits || [
      {
        id: `AUD-${Date.now().toString().slice(-6)}`,
        itemId: id,
        details: "Item created",
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
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
    lastRestocked: patch.lastRestocked ? new Date(patch.lastRestocked) : inventory[idx].lastRestocked,
    updatedAt: new Date(),
    audits: [
      {
        id: `AUD-${Date.now().toString().slice(-6)}`,
        itemId: id,
        details: `Item details updated`,
        createdAt: new Date(),
      },
      ...inventory[idx].audits,
    ],
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
  const parts = orderItems.split(",")
  parts.forEach((part) => {
    const qMatch = part.match(/x\s*(\d+)/i)
    const qty = qMatch ? parseInt(qMatch[1], 10) : 1
    const partNorm = part.toLowerCase()

    for (const menu of menuItems) {
      const menuName = menu.name.toLowerCase()
      if (
        partNorm.includes(menuName) ||
        (menuName.split(" ").slice(0, 2).join(" ") && partNorm.includes(menuName.split(" ").slice(0, 2).join(" ")))
      ) {
        const idx = inventory.findIndex((i) => i.id === menu.id)
        if (idx !== -1) {
          inventory[idx].stock = Math.max(0, inventory[idx].stock - qty)
          inventory[idx].updatedAt = new Date()
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
      category: i.category,
      stock: `${i.stock} ${i.unit}`,
      severity: i.stock <= 5 ? "critical" : ("warning" as const),
    }))
}
