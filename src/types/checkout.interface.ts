export type CheckoutFulfillmentMode = "delivery" | "pickup"

export type CheckoutPaymentMethod = "cod" | "sslcommerz"

export interface CheckoutFormData {
  fullName: string
  email: string
  phone: string
  city: string
  area: string
  streetAddress: string
  orderNote: string
}

export interface CheckoutOption {
  id: string
  title: string
  description: string
  emoji: string
}

export interface CheckoutPaymentOption extends CheckoutOption {
  value: CheckoutPaymentMethod
  badge: string
}

export interface MockOrderConfirmation {
  orderId: string
  customerName: string
  fulfillmentMode: CheckoutFulfillmentMode
  paymentMethod: CheckoutPaymentMethod
  payableTotal: number
}
