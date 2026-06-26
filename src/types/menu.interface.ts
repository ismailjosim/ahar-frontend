// ─── Enums ────────────────────────────────────────────────────────────────────

export type StockStatus = "in_stock" | "out_of_stock" | "limited"
export type MenuSortOption = "default" | "price-low" | "price-high" | "rating"

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

// Matches Prisma MenuItemVariant — id + menuItemId come back from the API
export interface MenuVariant {
  id?: string // present on existing records, absent on new unsaved ones
  menuItemId?: string
  name: string // e.g. "Regular", "Large", "Family Pack"
  markup: number // price added on top of base price (0 = same price)
  sortOrder: number // was missing — exists in Prisma model and Zod schema
}

// Matches Prisma MenuItemAddOn
export interface MenuAddOn {
  id?: string
  menuItemId?: string
  name: string // e.g. "Extra Mutton", "Borhani"
  price: number // standalone price for the add-on
  isAvailable: boolean // was missing — exists in Prisma model and Zod schema
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
  slug?: string // Optional — Prisma: String? @unique; auto-generated server-side
  description?: string // Optional — Prisma: String @default(""); treat "" as absent
  category: string

  // Pricing
  price: number // base price in BDT
  discountPrice?: number
  discountPercent?: number

  // Media
  imageUrl?: string
  emoji?: string // used in MenuCatalog fallback display; not in Prisma (frontend-only)

  // Dietary flags
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isHalal: boolean
  isSpicy: boolean

  // Allergens
  allergens: Allergen[]

  // Nutrition
  nutrition?: NutritionInfo
  prepTime?: string // Optional — Prisma: String?; was incorrectly required before

  // Discovery
  tags: string[]
  sortOrder: number

  // Aggregated from Review model — optional because they're computed, not stored on MenuItem
  rating?: number
  reviewCount?: number

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

export type CreateMenuItemPayload = Omit<
  MenuItem,
  "id" | "slug" | "rating" | "reviewCount" | "createdAt" | "updatedAt" | "emoji"
>

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
