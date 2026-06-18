"use client"

import { useEffect, useState } from "react"
import type { AdminOrderRow } from "@/types/dashboard.interface"

interface OrdersPageContentProps {
  orders?: AdminOrderRow[]
}

const STATUS_SEQUENCE: AdminOrderRow["status"][] = ["Pending", "Preparing", "Ready", "Completed"]

export default function OrdersPageContent({ orders: initial }: OrdersPageContentProps) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initial || [])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<AdminOrderRow | null>(null)

  async function fetchList() {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("pageSize", String(pageSize))
    if (statusFilter) params.set("status", statusFilter)
    if (search) params.set("search", search)
    const res = await fetch(`/api/orders?${params.toString()}`)
    const body = await res.json()
    setOrders(body.data || [])
    setTotal(body.total || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  async function updateStatus(id: string) {
    const o = orders.find((x) => x.id === id)
    if (!o) return
    const idx = STATUS_SEQUENCE.indexOf(o.status)
    const next = STATUS_SEQUENCE[Math.min(idx + 1, STATUS_SEQUENCE.length - 1)]
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) {
      const updated: AdminOrderRow = await res.json()
      setOrders((prev) => prev.map((p) => (p.id === id ? updated : p)))
      // quick notification
      alert(`Order ${id} updated to ${updated.status}`)
    } else {
      alert("Failed to update order")
    }
  }

  async function viewDetails(id: string) {
    const res = await fetch(`/api/orders/${id}`)
    if (!res.ok) return alert("Not found")
    const data: AdminOrderRow = await res.json()
    setSelected(data)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#F3E5D8] bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">অর্ডার তালিকা</h3>
          <p className="font-bengali text-xs text-gray-400">সব অর্ডার দেখুন এবং স্ট্যাটাস পরিবর্তন করুন</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="rounded-md border px-3 py-1 text-sm"
            placeholder="Search id, customer, items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1)
                fetchList()
              }
            }}
          />
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            className="rounded-md bg-[#B22222] px-3 py-1 text-xs font-semibold text-white"
            onClick={() => {
              setPage(1)
              fetchList()
            }}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F3E5D8] bg-[#FFF8F0]/60 font-bengali text-xs font-semibold uppercase text-gray-500 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-400">
              <th className="px-6 py-3 text-center">অর্ডার আইডি</th>
              <th className="px-6 py-3">গ্রাহক</th>
              <th className="px-6 py-3">আইটেমসমূহ</th>
              <th className="px-6 py-3">পেমেন্ট</th>
              <th className="px-6 py-3 text-right">মোট</th>
              <th className="px-6 py-3 text-center">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-center">এ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3E5D8] text-sm dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">
                  No orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#FFF8F0]/40 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 text-center font-semibold text-gray-800 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bengali font-semibold text-gray-800 dark:text-white">{order.customer}</div>
                    <div className="font-bengali text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">{order.items}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300">{order.method}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">৳{order.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                          : order.status === "Preparing"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                            : order.status === "Ready"
                              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      }`}
                    >
                      {order.status === "Pending"
                        ? "অপেক্ষারত"
                        : order.status === "Preparing"
                          ? "প্রস্তুত হচ্ছে"
                          : order.status === "Ready"
                            ? "প্রস্তুত"
                            : "সম্পন্ন"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewDetails(order.id)}
                        className="rounded-md bg-[#B22222] px-3 py-1 text-xs font-semibold text-white"
                      >
                        View
                      </button>
                      <button
                        onClick={() => updateStatus(order.id)}
                        className="rounded-md bg-[#FFF8F0] px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-red-50 dark:bg-slate-700 dark:text-gray-300"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
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

      {/* Details modal - simple */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-slate-800">
            <h3 className="font-bengali text-lg font-bold">Order {selected.id}</h3>
            <p className="mt-2">
              Customer: {selected.customer} — {selected.phone}
            </p>
            <p className="mt-1">Items: {selected.items}</p>
            <p className="mt-1">
              Payment: {selected.method} • Total: ৳{selected.total}
            </p>
            <p className="mt-1">Status: {selected.status}</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelected(null)} className="rounded-md border px-3 py-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
