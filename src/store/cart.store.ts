import { create } from "zustand"
import { persist } from "zustand/middleware"

import { cartDeliveryCharge, cartVatRate } from "@/lib/cart.constant"
import { calculateCartTotals } from "@/lib/cart.utils"
import type { CartLineItem, CartTotals } from "@/types/cart.interface"

interface AppliedCoupon {
  code: string
  discount: number
}

interface CartStore {
  items: CartLineItem[]
  hasDelivery: boolean
  appliedCoupon: AppliedCoupon | null

  // Item actions
  addItem: (item: CartLineItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void

  // Delivery & coupon
  setDelivery: (value: boolean) => void
  applyDiscount: (code: string, discount: number) => void
  clearDiscount: () => void

  // Computed selectors
  getTotals: () => CartTotals
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasDelivery: true,
      appliedCoupon: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      setDelivery: (value) => set({ hasDelivery: value }),

      applyDiscount: (code, discount) => set({ appliedCoupon: { code, discount } }),

      clearDiscount: () => set({ appliedCoupon: null }),

      getTotals: (): CartTotals => {
        const { items, hasDelivery, appliedCoupon } = get()
        const base = calculateCartTotals(items, hasDelivery)

        if (!appliedCoupon) return base

        // Override discount with coupon amount, recalculate vat and total.
        const taxable = Math.max(0, base.subtotal - appliedCoupon.discount)
        const vat = Math.round(taxable * cartVatRate)
        const deliveryCharge = base.subtotal > 0 && hasDelivery ? cartDeliveryCharge : 0

        return {
          subtotal: base.subtotal,
          discount: appliedCoupon.discount,
          vat,
          deliveryCharge,
          total: taxable + vat + deliveryCharge,
        }
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "ahar-cart",
      // skipHydration avoids SSR mismatch — call useCartStore.persist.rehydrate()
      // inside a useEffect in the layout to restore persisted cart on the client.
      skipHydration: true,
    },
  ),
)
