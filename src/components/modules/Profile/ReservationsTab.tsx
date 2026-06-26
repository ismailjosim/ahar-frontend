"use client"

import { useEffect, useState } from "react"
import { UtensilsCrossed } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import LoadingState from "./LoadingState"
import EmptyState from "./EmptyState"
import Pagination from "./Pagination"
import ReservationCard from "./ReservationCard"

import type { ReservationHistoryItem } from "@/types/profile.interface"

const PAGE_SIZE = 5

interface ReservationResponse {
  data: ReservationHistoryItem[]
  total: number
}

export default function ReservationsTab() {
  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([])

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [total, setTotal] = useState(0)

  async function loadReservations(currentPage: number) {
    try {
      setLoading(true)

      const res = await fetch(`/api/reservations/my?page=${currentPage}&pageSize=${PAGE_SIZE}`, {
        cache: "no-store",
      })

      const json: ReservationResponse = await res.json()

      setReservations(json.data ?? [])
      setTotal(json.total ?? 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations(page)
  }, [page])

  async function handleCancel(id: string) {
    const res = await fetch(`/api/reservations/my/${id}/cancel`, {
      method: "PATCH",
    })

    if (!res.ok) return

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status: "Cancelled",
            }
          : reservation,
      ),
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="size-5 text-primary" />
          My Reservations
        </CardTitle>

        <CardDescription>
          {total > 0 ? `${total} reservation${total > 1 ? "s" : ""} found` : "Manage your restaurant reservations."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        {loading && <LoadingState />}

        {!loading && reservations.length === 0 && (
          <EmptyState icon={UtensilsCrossed} title="No Reservations" description="You haven't booked any table yet.">
            <Button asChild>
              <a href="/reservation">Book a Table</a>
            </Button>
          </EmptyState>
        )}

        {!loading &&
          reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} onCancel={handleCancel} />
          ))}

        {!loading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </CardContent>
    </Card>
  )
}
