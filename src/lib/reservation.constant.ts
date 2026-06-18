import type { ReservationFormData } from "@/types/reservation.interface"

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

export const defaultReservationForm: ReservationFormData = {
  customer: "",
  phone: "",
  date: tomorrow.toISOString().slice(0, 10),
  timeSlot: "7:00 PM",
  guests: "2",
  tablePreference: "Window Table",
  request: "",
}

export const reservationTimeSlots = ["12:30 PM", "1:30 PM", "6:30 PM", "7:00 PM", "7:45 PM", "8:30 PM", "9:15 PM"]

export const reservationGuestOptions = ["1", "2", "3", "4", "5", "6", "8", "10"]

export const reservationTablePreferences = [
  "Window Table",
  "Family Booth",
  "Quiet Corner",
  "Open Floor",
  "Private Dining",
  "Any Available",
]

export const reservationHighlights = [
  {
    label: "Confirmation",
    value: "Instant",
    text: "Bookings appear in the admin reservation queue as pending.",
  },
  {
    label: "Service",
    value: "Family Ready",
    text: "Choose guest count, preferred table, and special notes.",
  },
  {
    label: "Timing",
    value: "Lunch & Dinner",
    text: "Reserve ahead for premium dining slots.",
  },
]
