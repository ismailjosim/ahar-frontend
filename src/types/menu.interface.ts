export interface MenuCategory {
  name: string
  slug: string
}

export interface MenuVariant {
  name: string
  markup: number
}

export interface MenuAddOn {
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  emoji: string
  rating: number
  prepTime: string
  isFeatured: boolean
  isSpicy: boolean
  isAvailable: boolean
  tags: string[]
  variants: MenuVariant[]
  addOns: MenuAddOn[]
}

export interface MenuCartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export type MenuSortOption = "default" | "price-low" | "price-high" | "rating"
