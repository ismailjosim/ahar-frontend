import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

export interface FeaturedDish {
  name: string
  category: string
  price: string
  description: string
  badge: string
}

export interface HomeServiceStat {
  title: string
  description: string
  icon: LucideIcon
}

export interface OrderStep {
  title: string
  text: string
  icon: LucideIcon
}

export interface DashboardStat {
  label: string
  value: string
}
