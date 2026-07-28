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
  Placed: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/70",
  Accepted: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  Preparing: "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning/70",
  Ready: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "Out for Delivery": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  Delivered: "bg-success/10 text-success dark:bg-success/20 dark:text-success/70",
  Cancelled: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/70",

  // Reservation statuses
  Pending: "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning/70",
  Approved: "bg-success/10 text-success dark:bg-success/20 dark:text-success/70",

  // Payment statuses
  Paid: "bg-success/10 text-success dark:bg-success/20 dark:text-success/70",
  Unpaid: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/70",
  Refunded: "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300",

  // Availability
  Active: "bg-success/10 text-success dark:bg-success/20 dark:text-success/70",
  Inactive: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/70",
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
