export interface ProfileFormData {
  name: string
  phone: string
  imageUrl: string
}

export interface OrderHistoryItem {
  id: string
  createdAt: string
  items: string
  itemSummary: string
  total: number
  status: string
  fulfillmentType: string
}

export interface ReservationHistoryItem {
  id: string
  time: string
  guests: number
  table: string
  status: string
  occasion?: string | null
  notes?: string | null
}
