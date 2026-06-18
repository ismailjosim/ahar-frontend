import type { AdminOrderRow } from "@/types/dashboard.interface"
import { adjustStockFromOrderItems } from "@/lib/inventory.store"

const orders: AdminOrderRow[] = [
  {
    id: "1024",
    customer: "তাহসিন চৌধুরী",
    phone: "01755112233",
    items: "Royal Kacchi x 2, Borhani x 2",
    method: "bKash",
    total: 1060,
    status: "Placed",
    type: "Delivery",
  },
  {
    id: "1023",
    customer: "নাদিয়া পারভীন",
    phone: "01912998811",
    items: "Shorshe Ilish x 1, Plain Rice x 2",
    method: "COD",
    total: 820,
    status: "Accepted",
    type: "Pickup",
  },
  {
    id: "1022",
    customer: "ড. শরিফুল ইসলাম",
    phone: "01811445566",
    items: "Chicken Roast Combo x 3",
    method: "SSLCOMMERZ",
    total: 1080,
    status: "Ready",
    type: "Dine-In",
  },
  {
    id: "1021",
    customer: "রাফি আহমেদ",
    phone: "01617112233",
    items: "Beef Tehari x 2, Firni x 2",
    method: "Nagad",
    total: 760,
    status: "Delivered",
    type: "Delivery",
  },
]

export function listOrders({
  page = 1,
  pageSize = 10,
  status,
  search,
}: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) {
  let filtered = orders.slice()
  if (status) filtered = filtered.filter((o) => o.status === status)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (o) => o.id.includes(q) || o.customer.toLowerCase().includes(q) || o.items.toLowerCase().includes(q),
    )
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)
  return { data: paged, total }
}

export function getOrderById(id: string) {
  return orders.find((o) => o.id === id) || null
}

export function updateOrderStatus(id: string, status: AdminOrderRow["status"]) {
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], status }
  const updated = orders[idx]
  // If order marked delivered, adjust inventory
  if (status === "Delivered") {
    try {
      adjustStockFromOrderItems(updated.items)
    } catch (e) {
      // swallow errors in mock
    }
  }
  return updated
}
