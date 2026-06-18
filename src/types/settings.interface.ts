export interface RestaurantSettings {
  restaurantName: string
  supportPhone: string
  supportEmail: string
  address: string
  openingTime: string
  closingTime: string
  deliveryFee: number
  freeDeliveryMin: number
  vatRate: number
  serviceChargeRate: number
  acceptCod: boolean
  acceptBkash: boolean
  acceptNagad: boolean
  acceptSslcommerz: boolean
  lowStockAlerts: boolean
  reservationAlerts: boolean
  paymentAlerts: boolean
}
