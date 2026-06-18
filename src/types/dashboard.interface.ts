import type { LucideIcon } from "lucide-react"

export interface AdminNavItem {
  href: string
  label: string
  badge?: string
  icon: LucideIcon
}

export interface DashboardStatCard {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: "primary" | "accent" | "success" | "warning"
}

export interface RevenuePoint {
  day: string
  amount: number
}

export interface AdminOrderRow {
  id: string
  customer: string
  phone: string
  items: string
  method: string
  total: number
  status: "Pending" | "Preparing" | "Ready" | "Completed"
  type: "Delivery" | "Pickup" | "Dine-In"
}

export interface AdminReservationRow {
  id: string
  customer: string
  phone: string
  guests: number
  time: string
  table: string
  status: "Pending" | "Approved"
}

export interface LowStockItem {
  item: string
  category: string
  stock: string
  severity: "critical" | "warning"
}

export interface DashboardNotification {
  id: string
  type: "warning" | "success" | "info"
  title: string
  timestamp: string
}
