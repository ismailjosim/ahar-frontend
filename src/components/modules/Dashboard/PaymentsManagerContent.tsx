"use client"

import { useEffect, useState } from "react"
import type { PaymentRecord } from "@/lib/payments.store"

export default function PaymentsManagerContent() {
  const [items, setItems] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)

  async function fetchList() {
    setLoading(true)
    const res = await fetch(`/api/payments?page=${page}&pageSize=${pageSize}`)
    const body = await res.json()
    setItems(body.data || [])
    setTotal(body.total || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [page])

  async function refund(id: string) {
    if (!confirm("Issue refund for this payment?")) return
    const res = await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Refunded" }),
    })
    if (res.ok) fetchList()
    else alert("Failed to refund")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bengali text-lg font-bold">Transactions</h3>
          <p className="text-sm text-gray-500">View and manage payment transactions</p>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 dark:border-slate-700 dark:bg-slate-800">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500">
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
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.orderId || "-"}
                    <div className="text-xs text-gray-400">{p.transactionId || ""}</div>
                  </td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 text-right">৳{p.amount}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.status !== "Refunded" && (
                        <button onClick={() => refund(p.id)} className="rounded px-2 py-1 text-xs bg-amber-100">
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => alert(JSON.stringify(p, null, 2))}
                        className="rounded px-2 py-1 text-xs border"
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
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border px-3 py-1 text-sm"
          >
            Prev
          </button>
          <div className="text-sm">Page {page}</div>
          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
