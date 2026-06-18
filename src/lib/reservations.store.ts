import type { AdminReservationRow } from "@/types/dashboard.interface"
import { recentAdminReservations } from "@/lib/dashboard.constant"

let reservations: AdminReservationRow[] = [...recentAdminReservations]

function generateId(prefix = "R") {
  return `${prefix}-${Date.now().toString().slice(-6)}`
}

export function listReservations({
  page = 1,
  pageSize = 20,
  status,
  search,
}: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) {
  let filtered = reservations.slice()
  if (status) filtered = filtered.filter((r) => r.status === status)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.table.toLowerCase().includes(q),
    )
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { data: filtered.slice(start, start + pageSize), total }
}

export function getReservationById(id: string) {
  return reservations.find((r) => r.id === id) || null
}

export function createReservation(payload: Partial<AdminReservationRow>) {
  const id = payload.id || generateId()
  const newRes: AdminReservationRow = {
    id,
    customer: payload.customer || "Guest",
    phone: payload.phone || "",
    guests: payload.guests || 2,
    time: payload.time || "TBD",
    table: payload.table || "TBD",
    status: payload.status || "Pending",
  }
  reservations = [newRes, ...reservations]
  return newRes
}

export function updateReservation(id: string, patch: Partial<AdminReservationRow>) {
  const idx = reservations.findIndex((r) => r.id === id)
  if (idx === -1) return null
  reservations[idx] = { ...reservations[idx], ...patch }
  return reservations[idx]
}

export function deleteReservation(id: string) {
  const idx = reservations.findIndex((r) => r.id === id)
  if (idx === -1) return false
  reservations.splice(idx, 1)
  return true
}
