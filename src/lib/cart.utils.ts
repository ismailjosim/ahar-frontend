import { cartDeliveryCharge, cartDiscountRate, cartVatRate } from "@/lib/cart.constant"
import type { CartLineItem, CartTotals } from "@/types/cart.interface"

export const formatCurrency = (amount: number) => `৳${amount.toLocaleString("en-BD")}`

export const calculateLineTotal = (item: CartLineItem) => {
  const addOnTotal = item.addOns.reduce((total, addOn) => total + addOn.price, 0)

  return (item.unitPrice + addOnTotal) * item.quantity
}

export const calculateCartTotals = (items: CartLineItem[], hasDelivery = true): CartTotals => {
  const subtotal = items.reduce((total, item) => total + calculateLineTotal(item), 0)
  const discount = Math.round(subtotal * cartDiscountRate)
  const vat = Math.round(subtotal * cartVatRate)
  const deliveryCharge = subtotal > 0 && hasDelivery ? cartDeliveryCharge : 0

  return {
    subtotal,
    discount,
    vat,
    deliveryCharge,
    total: subtotal - discount + vat + deliveryCharge,
  }
}
