"use client"

import { useEffect, useState } from "react"

import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import LoadingState from "./LoadingState"
import EmptyState from "./EmptyState"
import OrderCard from "./OrderCard"
import Pagination from "./Pagination"

import type { AdminOrderRow } from "@/types/dashboard.interface"

const PAGE_SIZE = 5

interface OrdersResponse {
  data: AdminOrderRow[]
  total: number
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [total, setTotal] = useState(0)

  async function loadOrders(currentPage: number) {
    try {
      setLoading(true)

      const res = await fetch(`/api/orders/my?page=${currentPage}&pageSize=${PAGE_SIZE}`, {
        cache: "no-store",
      })

      const json: OrdersResponse = await res.json()

      setOrders(json.data ?? [])
      setTotal(json.total ?? 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders(page)
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="size-5 text-primary" />
          My Orders
        </CardTitle>

        <CardDescription>
          {total > 0 ? `${total} order${total > 1 ? "s" : ""} found` : "View your previous food orders."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        {loading && <LoadingState />}

        {!loading && orders.length === 0 && (
          <EmptyState icon={ShoppingBag} title="No Orders Yet" description="Looks like you haven't placed any orders.">
            <Button asChild>
              <a href="/menu">Browse Menu</a>
            </Button>
          </EmptyState>
        )}

        {!loading && orders.map((order) => <OrderCard key={order.id} order={order} />)}

        {!loading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </CardContent>
    </Card>
  )
}
