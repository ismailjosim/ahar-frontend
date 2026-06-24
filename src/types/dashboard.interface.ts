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

export interface OrderLineItem {
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  variant?: Record<string, unknown> | null
  addOns?: unknown[] | null
}

export interface AdminOrderRow {
  id: string
  customer: string
  phone: string
  items: string
  method: string
  total: number
  status: "Placed" | "Accepted" | "Preparing" | "Ready" | "Out for Delivery" | "Delivered" | "Cancelled"
  type: "Delivery" | "Pickup" | "Dine-In"
  // Detail fields — present when fetched from a single-order endpoint.
  email?: string | null
  fulfillmentType?: string
  itemSummary?: string
  lineItems?: OrderLineItem[]
  address?: string | null
  notes?: string | null
  subtotal?: number
  deliveryFee?: number
  vat?: number
  serviceCharge?: number
  discount?: number
  paymentMethod?: string
  paymentStatus?: string
  createdAt?: string
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

export interface BestSellerItem {
  name: string
  quantity: number
  revenue: number
}

export interface OrderStatusStat {
  status: string
  count: number
}

export interface PaymentMethodStat {
  method: string
  count: number
  total: number
}

export interface ReportSummary {
  revenue: number
  totalOrders: number
  avgOrderValue: number
  topItems: BestSellerItem[]
  ordersByStatus: OrderStatusStat[]
  paymentsByMethod: PaymentMethodStat[]
  fromDate: string
  toDate: string
}
