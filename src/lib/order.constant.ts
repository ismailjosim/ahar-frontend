import type { AdminOrderRow } from "@/types/dashboard.interface"

export const orderStatusSequence: AdminOrderRow["status"][] = [
  "Placed",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
]

export const orderStatusLabels: Record<AdminOrderRow["status"], string> = {
  Placed: "অর্ডার নেওয়া হয়েছে",
  Accepted: "রেস্টুরেন্ট গ্রহণ করেছে",
  Preparing: "প্রস্তুত হচ্ছে",
  Ready: "প্রস্তুত",
  "Out for Delivery": "ডেলিভারিতে আছে",
  Delivered: "ডেলিভার হয়েছে",
  Cancelled: "বাতিল হয়েছে",
}

export const orderStatusDescriptions: Record<AdminOrderRow["status"], string> = {
  Placed: "Your order has entered the kitchen queue.",
  Accepted: "The restaurant team confirmed your order.",
  Preparing: "Our kitchen is preparing your food.",
  Ready: "Your order is packed and ready.",
  "Out for Delivery": "The rider is on the way.",
  Delivered: "Your order has been completed.",
  Cancelled: "This order was cancelled.",
}
