import type { RestaurantSettings } from "@/types/settings.interface"

let settings: RestaurantSettings = {
  restaurantName: "আহার Premium Dining",
  supportPhone: "01755112233",
  supportEmail: "support@ahar.example",
  address: "Gulshan Avenue, Dhaka",
  openingTime: "11:00",
  closingTime: "23:00",
  deliveryFee: 80,
  freeDeliveryMin: 1500,
  vatRate: 5,
  serviceChargeRate: 10,
  acceptCod: true,
  acceptBkash: true,
  acceptNagad: true,
  acceptSslcommerz: false,
  lowStockAlerts: true,
  reservationAlerts: true,
  paymentAlerts: true,
}

export function getSettings() {
  return settings
}

export function updateSettings(patch: Partial<RestaurantSettings>) {
  settings = { ...settings, ...patch }
  return settings
}
