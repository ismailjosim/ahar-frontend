/**
 * dashboard.constant.ts
 *
 * Mock data and configuration for the admin dashboard.
 *
 * Navigation items have been moved to src/lib/navitems.config.ts —
 * import { adminNavItems, adminControlItems } from "@/lib/navitems.config".
 */

import { Bell, CalendarCheck, ChartPie, ClipboardList, ShoppingBag, WalletCards } from "lucide-react"

import type {
  AdminOrderRow,
  AdminReservationRow,
  DashboardNotification,
  DashboardStatCard,
  LowStockItem,
  RevenuePoint,
} from "@/types/dashboard.interface"

export const dashboardStats: DashboardStatCard[] = [
  {
    label: "আজকের মোট বিক্রি",
    value: "৳42,750",
    helper: "গতকাল ছিল: ৳38,250",
    icon: WalletCards,
    tone: "primary",
  },
  {
    label: "নতুন লাইভ অর্ডার",
    value: "04",
    helper: "১টি অপেক্ষারত",
    icon: ShoppingBag,
    tone: "accent",
  },
  {
    label: "টেবিল রিজার্ভেশন",
    value: "03",
    helper: "মোট বুকিং: ১২",
    icon: CalendarCheck,
    tone: "success",
  },
  {
    label: "সক্রিয় মেনু আইটেম",
    value: "56",
    helper: "স্টক আউট: ০৪",
    icon: ClipboardList,
    tone: "warning",
  },
  {
    label: "লো স্টক সতর্কতা",
    value: "05",
    helper: "২টি জরুরি রিফিল দরকার",
    icon: Bell,
    tone: "primary",
  },
]

export const revenuePoints: RevenuePoint[] = [
  { day: "Mon", amount: 28000 },
  { day: "Tue", amount: 34000 },
  { day: "Wed", amount: 31000 },
  { day: "Thu", amount: 42750 },
  { day: "Fri", amount: 39000 },
  { day: "Sat", amount: 47000 },
  { day: "Sun", amount: 52000 },
]

export const popularAdminItems = [
  { name: "Royal Mutton Kacchi", orders: 38, share: 88 },
  { name: "Shorshe Ilish", orders: 24, share: 68 },
  { name: "Chicken Roast Combo", orders: 21, share: 58 },
]

export const recentAdminOrders: AdminOrderRow[] = [
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

export const recentAdminReservations: AdminReservationRow[] = [
  {
    id: "R-210",
    customer: "মাহিরা খান",
    phone: "01722998811",
    guests: 4,
    time: "Today, 8:30 PM",
    table: "T-06",
    status: "Pending",
  },
  {
    id: "R-209",
    customer: "আরিফুল ইসলাম",
    phone: "01888123456",
    guests: 6,
    time: "Today, 9:00 PM",
    table: "Family Room",
    status: "Approved",
  },
  {
    id: "R-208",
    customer: "সুমাইয়া রহমান",
    phone: "01912121212",
    guests: 2,
    time: "Tomorrow, 7:45 PM",
    table: "Window-02",
    status: "Pending",
  },
]

export const lowStockItems: LowStockItem[] = [
  {
    item: "Premium Basmati Rice",
    category: "Kitchen Staple",
    stock: "8 kg",
    severity: "critical",
  },
  {
    item: "Mustard Oil",
    category: "Cooking Essentials",
    stock: "5 bottles",
    severity: "warning",
  },
  {
    item: "Borhani Cups",
    category: "Packaging",
    stock: "42 pcs",
    severity: "warning",
  },
]

export const dashboardNotifications: DashboardNotification[] = [
  {
    id: "notif-live-orders",
    type: "info",
    title: "নতুন ৪টি লাইভ অর্ডার অপেক্ষায় আছে।",
    timestamp: "এইমাত্র",
  },
  {
    id: "notif-reservations",
    type: "warning",
    title: "৩টি টেবিল রিজার্ভেশন যাচাই করা প্রয়োজন।",
    timestamp: "১০ মিনিট আগে",
  },
  {
    id: "notif-low-stock-rice",
    type: "warning",
    title: "Premium Basmati Rice low stock alert.",
    timestamp: "২৫ মিনিট আগে",
  },
]

export const dashboardDateLabel = "১৮ জুন ২০২৬ • বৃহস্পতিবার"

export const dashboardSectionIcon = ChartPie
