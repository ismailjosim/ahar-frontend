"use client"

import { useEffect, useState } from "react"
import type { AdminReservationRow } from "@/types/dashboard.interface"

export default function ReservationsManagerContent() {
  const [items, setItems] = useState<AdminReservationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<AdminReservationRow | null>(null)
  const [form, setForm] = useState<Partial<AdminReservationRow>>({})

  async function fetchList() {
    setLoading(true)
    const res = await fetch(`/api/reservations?page=${page}&pageSize=${pageSize}`)
    const body = await res.json()
    setItems(body.data || [])
    setTotal(body.total || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [page])

  function openCreate() {
    setEditing(null)
    setForm({ customer: "", phone: "", guests: 2, time: "Today, 7:00 PM", table: "T-01", status: "Pending" })
  }

  function openEdit(r: AdminReservationRow) {
    setEditing(r)
    setForm(r)
  }

  async function submit() {
    if (!form.customer) return alert("Customer is required")
    if (editing) {
      const res = await fetch(`/api/reservations/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        fetchList()
        setEditing(null)
        setForm({})
      }
    } else {
      const res = await fetch(`/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        fetchList()
        setForm({})
      }
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete reservation?")) return
    const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" })
    if (res.ok) fetchList()
  }

  async function approve(id: string) {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    })
    if (res.ok) fetchList()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bengali text-lg font-bold">Reservations</h3>
          <p className="text-sm text-gray-500">Manage table bookings and confirmations</p>
        </div>
        <div>
          <button onClick={openCreate} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">
            New Reservation
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 dark:border-slate-700 dark:bg-slate-800">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3">
                    {r.customer} <div className="text-xs text-gray-400">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.guests}</td>
                  <td className="px-4 py-3">{r.time}</td>
                  <td className="px-4 py-3">{r.table}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.status === "Pending" && (
                        <button
                          onClick={() => approve(r.id)}
                          className="rounded px-2 py-1 text-xs bg-(--success)/20 text-success-foreground"
                        >
                          Approve
                        </button>
                      )}
                      <button onClick={() => openEdit(r)} className="rounded px-2 py-1 text-xs border">
                        Edit
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="rounded px-2 py-1 text-xs border text-destructive"
                      >
                        Delete
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

      <div className="rounded-lg border border-border bg-card p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="font-bengali font-bold">{editing ? "Edit Reservation" : "Create Reservation"}</h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            placeholder="Customer"
            value={form.customer || ""}
            onChange={(e) => setForm((s) => ({ ...s, customer: e.target.value }))}
            className="rounded border px-3 py-2"
          />
          <input
            placeholder="Phone"
            value={form.phone || ""}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            className="rounded border px-3 py-2"
          />
          <input
            type="number"
            placeholder="Guests"
            value={form.guests ?? 2}
            onChange={(e) => setForm((s) => ({ ...s, guests: Number(e.target.value) }))}
            className="rounded border px-3 py-2"
          />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <input
            placeholder="Time (e.g., Today, 8:00 PM)"
            value={form.time || ""}
            onChange={(e) => setForm((s) => ({ ...s, time: e.target.value }))}
            className="rounded border px-3 py-2"
          />
          <input
            placeholder="Table (e.g., T-01)"
            value={form.table || ""}
            onChange={(e) => setForm((s) => ({ ...s, table: e.target.value }))}
            className="rounded border px-3 py-2 max-w-xs"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={submit} className="rounded-md bg-primary px-3 py-2 text-white">
            Save
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setForm({})
            }}
            className="rounded-md border px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
