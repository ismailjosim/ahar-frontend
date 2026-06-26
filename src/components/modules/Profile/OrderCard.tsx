"use client"

import Link from "next/link"

import { Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { orderStatusLabels } from "@/lib/order.constant"

import type { AdminOrderRow } from "@/types/dashboard.interface"

interface OrderCardProps {
  order: AdminOrderRow
}

const statusStyles: Record<string, string> = {
  Placed: "bg-blue-500/10 text-blue-500 border-blue-500/20",

  Accepted: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",

  Preparing: "bg-warning-soft text-warning-foreground border-warning/30",

  Ready: "bg-primary-soft text-primary border-primary/20",

  "Out for Delivery": "bg-purple-500/10 text-purple-500 border-purple-500/20",

  Delivered: "bg-success-soft text-success border-success/20",

  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = orderStatusLabels[order.status as keyof typeof orderStatusLabels] ?? order.status

  const statusClass = statusStyles[order.status] ?? "bg-muted text-muted-foreground"

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A"

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">Order #{order.id.slice(0, 8)}</h4>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />

            {formattedDate}
          </div>
        </div>

        <Badge variant="outline" className={statusClass}>
          {status}
        </Badge>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{order.items || order.itemSummary || "No items available"}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>

          <p className="text-lg font-bold text-primary">৳{order.total.toFixed(2)}</p>
        </div>

        {order.fulfillmentType && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />

            {order.fulfillmentType}
          </div>
        )}

        <Button asChild variant="outline">
          <Link href={`/order-tracking?id=${order.id}`}>Track Order</Link>
        </Button>
      </div>
    </div>
  )
}
