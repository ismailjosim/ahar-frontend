export interface ReservationFormData {
  customer: string
  phone: string
  email: string
  date: string
  timeSlot: string
  guests: string
  tablePreference: string
  request: string
}

export interface ReservationConfirmation {
  id: string
  customer: string
  guests: number
  time: string
  table: string
  status: string
}

export type ReservationFormErrors = Partial<Record<keyof ReservationFormData, string>>
