// ─── Enums ────────────────────────────────────────────────────────────────────

export type StockStatus = "in_stock" | "out_of_stock" | "limited"

export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "nuts"
  | "peanuts"
  | "soy"
  | "fish"
  | "shellfish"
  | "sesame"
  | "mustard"

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface MenuVariant {
  name: string // e.g. "Regular", "Large", "Family Pack"
  markup: number // price added on top of base price (0 means same price)
}

export interface MenuAddOn {
  name: string // e.g. "Extra Mutton", "Borhani"
  price: number // standalone price for the add-on
}

export interface NutritionInfo {
  calories?: number // kcal
  protein?: number // grams
  carbs?: number // grams
  fat?: number // grams
}

// ─── Core MenuItem interface ──────────────────────────────────────────────────

export interface MenuItem {
  // Identity
  id: string
  name: string
  slug: string // URL-safe identifier e.g. "royal-mutton-kacchi-biryani"
  description: string
  category: string

  // Pricing
  price: number // base price in BDT
  discountPrice?: number // discounted selling price (if on offer)
  discountPercent?: number // e.g. 10 for 10% off — derived but useful for display

  // Media
  imageUrl?: string

  // Dietary flags
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isHalal: boolean
  isSpicy: boolean

  // Allergens
  allergens: Allergen[] //* e.g. ["gluten", "dairy"] any normally harmless substance that triggers an allergic reaction in your body's immune system

  // Nutrition
  nutrition?: NutritionInfo
  prepTime: string // human-readable e.g. "25 min"

  // Discovery & SEO
  tags: string[] // e.g. ["Signature", "Popular", "Chef Special"]
  rating?: number // 0–5
  reviewCount?: number
  sortOrder: number // lower = appears first in listing

  // Status
  isFeatured: boolean
  isAvailable: boolean
  stockStatus: StockStatus

  // Customization
  variants: MenuVariant[]
  addOns: MenuAddOn[]

  // Audit
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

// ─── Form / create payload (omits server-generated fields) ───────────────────

export type CreateMenuItemPayload = Omit<MenuItem, "id" | "slug" | "rating" | "reviewCount" | "createdAt" | "updatedAt">

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>

// ─── API response wrappers ────────────────────────────────────────────────────

export interface MenuItemResponse {
  success: boolean
  data: MenuItem
  message?: string
}

export interface MenuItemListResponse {
  success: boolean
  data: MenuItem[]
  total: number
  page: number
  pageSize: number
}
