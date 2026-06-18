import type { CheckoutOption, CheckoutPaymentOption } from "@/types/checkout.interface"

export const fulfillmentOptions: CheckoutOption[] = [
  {
    id: "delivery",
    title: "Premium Home Delivery",
    description: "In-claypot hot delivery inside Dhaka city",
    emoji: "🚗",
  },
  {
    id: "pickup",
    title: "Claypot Restaurant Pickup",
    description: "Pick up hot at Dhanmondi branch for free",
    emoji: "🏬",
  },
]

export const deliveryAreas = ["Dhanmondi", "Banani", "Gulshan", "Uttara", "Mirpur", "Mohammadpur"]

export const paymentOptions: CheckoutPaymentOption[] = [
  {
    id: "payment-cod",
    value: "cod",
    title: "Cash on Delivery",
    description: "Pay directly to the rider after receiving your order",
    emoji: "💵",
    badge: "Available now",
  },
  {
    id: "payment-sslcommerz",
    value: "sslcommerz",
    title: "SSLCOMMERZ Gateway",
    description: "Sandbox placeholder for card, bKash, Nagad, and wallet payment",
    emoji: "💳",
    badge: "Coming soon",
  },
]

export const defaultCheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "Dhaka City",
  area: deliveryAreas[0],
  streetAddress: "",
  orderNote: "",
}
