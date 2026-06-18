"use client"

import { useEffect, useState } from "react"
import { notifyDashboard } from "@/components/modules/Dashboard/DashboardNotificationToasts"
import type { PaymentRecord } from "@/lib/payments.store"
import type { AdminOrderRow } from "@/types/dashboard.interface"

export default function PaymentsManagerContent() {
  const [items, setItems] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")
  const [refundTarget, setRefundTarget] = useState<PaymentRecord | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null)

  async function fetchList() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (statusFilter) params.set("status", statusFilter)
    if (search) params.set("search", search)
    const res = await fetch(`/api/payments?${params.toString()}`)
    const body = await res.json()
    setItems(body.data || [])
    setTotal(body.total || 0)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  async function refund(id: string) {
    const res = await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Refunded" }),
    })
    if (res.ok) {
      setRefundTarget(null)
      fetchList()
      notifyDashboard(`Payment ${id} marked as refunded`, "success")
    } else notifyDashboard("Failed to refund payment", "warning")
  }

  async function openOrder(orderId?: string) {
    if (!orderId) return
    const res = await fetch(`/api/orders/${orderId}`)
    if (!res.ok) return alert("Related order not found")
    setSelectedOrder(await res.json())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-bengali text-lg font-bold">Transactions</h3>
          <p className="text-sm text-muted-foreground">View and manage payment transactions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setPage(1)
                fetchList()
              }
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Search payment/order/txn"
          />
          <select
            value={statusFilter}
            onChange={(event) => {
              setPage(1)
              setStatusFilter(event.target.value)
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
          <button
            onClick={() => {
              setPage(1)
              fetchList()
            }}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-warning-soft p-4 text-sm text-warning-foreground">
        Gateway note: bKash, Nagad, and SSLCOMMERZ payment success must be verified server-side through signed provider
        callbacks or IPN/webhook endpoints before marking an order paid.
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.orderId ? (
                      <button onClick={() => openOrder(p.orderId)} className="font-bold text-primary hover:underline">
                        {p.orderId}
                      </button>
                    ) : (
                      "-"
                    )}
                    <div className="text-xs text-muted-foreground">{p.transactionId || ""}</div>
                  </td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 text-right">৳{p.amount}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.status !== "Refunded" && (
                        <button
                          onClick={() => setRefundTarget(p)}
                          className="rounded-md border border-warning/30 bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning-foreground transition hover:border-warning/60 hover:bg-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning/30 dark:hover:text-accent-foreground"
                        >
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => alert(JSON.stringify(p, null, 2))}
                        className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-card-foreground transition hover:border-primary/40 hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">Page {page}</div>
          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
            <h3 className="font-bengali text-lg font-black">Confirm Refund</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refund {refundTarget.id} for order {refundTarget.orderId || "N/A"}? This will mark the mock payment as
              Refunded for reconciliation.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRefundTarget(null)}
                className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => refund(refundTarget.id)}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
            <h3 className="font-bengali text-lg font-black">Related Order #{selectedOrder.id}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                Customer: {selectedOrder.customer} — {selectedOrder.phone}
              </p>
              <p>Items: {selectedOrder.items}</p>
              <p>
                Payment: {selectedOrder.method} • Total: ৳{selectedOrder.total}
              </p>
              <p>Status: {selectedOrder.status}</p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
