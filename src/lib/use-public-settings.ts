"use client"
import { useEffect, useState } from "react"

export interface PublicSettings {
  restaurantName: string
  supportPhone: string
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
  maxTablesPerSlot: number
}

let cachedSettings: PublicSettings | null = null

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings | null>(cachedSettings)

  useEffect(() => {
    if (cachedSettings) return // use cached value
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((json) => {
        cachedSettings = json
        setSettings(json)
      })
      .catch(() => {}) // fail silently — use defaults
  }, [])

  return settings
}
