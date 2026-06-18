import type { CartLineItem } from "@/types/cart.interface"

export const demoCartItems: CartLineItem[] = [
  {
    id: "cart-royal-mutton-kacchi",
    name: "Royal Mutton Kacchi Biryani",
    category: "বিরিয়ানি",
    emoji: "🍛",
    variant: "Regular",
    note: "Less oil, extra salad",
    unitPrice: 420,
    quantity: 2,
    addOns: [
      { name: "Extra Mutton", price: 140 },
      { name: "Borhani", price: 80 },
    ],
  },
  {
    id: "cart-shorshe-ilish",
    name: "Shorshe Ilish",
    category: "মাছ",
    emoji: "🐟",
    variant: "Large Piece",
    unitPrice: 700,
    quantity: 1,
    addOns: [{ name: "Plain Rice", price: 60 }],
  },
  {
    id: "cart-firni",
    name: "Royal Firni",
    category: "মিষ্টান্ন",
    emoji: "🍮",
    variant: "Cup",
    unitPrice: 120,
    quantity: 2,
    addOns: [{ name: "Extra Nuts", price: 30 }],
  },
]

export const cartCouponPlaceholder = "AHAR10"
export const cartVatRate = 0.05
export const cartDiscountRate = 0.1
export const cartDeliveryCharge = 60
