export interface MenuVariant {
  name: string
  price: number
}

export interface MenuAddon {
  name: string
  price: number
}

export interface MenuCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  categoryId: string
  price: number
  imageUrl: string
  rating: number
  prepTime: string
  tags: string[]
  variants: MenuVariant[]
  addOns: MenuAddon[]
  isFeatured: boolean
  isSpicy: boolean
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  category: MenuCategory
}
