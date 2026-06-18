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
  emoji: string
  rating: string
}

export interface HomeServiceStat {
  title: string
  description: string
  value: string
}

export interface OrderStep {
  title: string
  text: string
  tone: "gold" | "red" | "green"
}

export interface DashboardStat {
  label: string
  value: string
}

export interface Review {
  name: string
  role: string
  initials: string
  text: string
}
