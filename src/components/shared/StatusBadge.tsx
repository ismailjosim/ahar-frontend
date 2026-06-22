/**
 * StatusBadge.tsx
 *
 * A coloured pill badge for displaying record statuses (orders, reservations,
 * payments, etc.) consistently across all management tables.
 *
 * Usage:
 *   <StatusBadge status="Delivered" />
 *   <StatusBadge status="Pending" />
 *   <StatusBadge status="Approved" />
 *
 * Add new statuses to STATUS_MAP as needed.
 */

const STATUS_MAP: Record<string, string> = {
  // Order statuses
  Placed: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Accepted: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Preparing: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Ready: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "Out for Delivery": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  Delivered: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",

  // Reservation statuses
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Approved: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",

  // Payment statuses
  Paid: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  Unpaid: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  Refunded: "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300",

  // Availability
  Active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  Inactive: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
}

const DEFAULT_CLASS = "bg-muted text-muted-foreground"

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colorClass = STATUS_MAP[status] ?? DEFAULT_CLASS

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${colorClass} ${className}`}
    >
      {status}
    </span>
  )
}
