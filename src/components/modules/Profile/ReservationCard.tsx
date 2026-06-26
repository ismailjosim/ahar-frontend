"use client"

import { CalendarDays, Clock, Loader2, Users, UtensilsCrossed, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { ReservationHistoryItem } from "@/types/profile.interface"

interface ReservationCardProps {
  reservation: ReservationHistoryItem
  onCancel: (id: string) => void | Promise<void>
  cancelling?: boolean
}

const statusStyles: Record<string, string> = {
  Pending: "border-warning/30 bg-warning-soft text-warning-foreground",

  Approved: "border-success/20 bg-success-soft text-success",

  Rejected: "border-destructive/20 bg-destructive/10 text-destructive",

  Cancelled: "border-border bg-muted text-muted-foreground",
}

export default function ReservationCard({ reservation, onCancel, cancelling = false }: ReservationCardProps) {
  const canCancel = reservation.status === "Pending" || reservation.status === "Approved"

  const statusClass = statusStyles[reservation.status] ?? "border-border bg-muted text-muted-foreground"

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">Reservation #{reservation.id.slice(0, 8)}</h4>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />

            {"reservation"}
          </div>
        </div>

        <Badge variant="outline" className={statusClass}>
          {reservation.status}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />

          {reservation.time}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {reservation.guests} Guest
          {reservation.guests > 1 ? "s" : ""}
        </div>

        {reservation.table && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UtensilsCrossed className="h-4 w-4" />

            {reservation.table}
          </div>
        )}
      </div>

      {(reservation.occasion || reservation.notes) && (
        <div className="mt-5 rounded-xl bg-muted/40 p-3">
          {reservation.occasion && <p className="font-medium">{reservation.occasion}</p>}

          {reservation.notes && <p className="mt-1 text-sm text-muted-foreground">{reservation.notes}</p>}
        </div>
      )}

      {canCancel && (
        <div className="mt-6 flex justify-end">
          <Button variant="destructive" size="sm" disabled={cancelling} onClick={() => onCancel(reservation.id)}>
            {cancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel Reservation
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
