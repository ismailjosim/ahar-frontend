export interface CartLineAddOn {
  name: string
  price: number
}

export interface CartLineItem {
  id: string
  name: string
  category: string
  emoji?: string
  imageUrl?: string
  variant?: string
  note?: string
  unitPrice: number
  quantity: number
  addOns: CartLineAddOn[]
}

export interface CartTotals {
  subtotal: number
  discount: number
  vat: number
  deliveryCharge: number
  total: number
}
