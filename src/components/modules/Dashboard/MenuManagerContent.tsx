"use client"

import { useEffect, useState } from "react"
import type { MenuItem } from "@/types/menu.interface"
import { menuCategories } from "@/lib/menu.constant"

export default function MenuManagerContent() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<Partial<MenuItem>>({})

  async function fetchList() {
    setLoading(true)
    const res = await fetch(`/api/menu?page=${page}&pageSize=${pageSize}`)
    const body = await res.json()
    setItems(body.data || [])
    setTotal(body.total || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function openCreate() {
    setEditing(null)
    setForm({ name: "", description: "", category: "All Dishes", price: 0, emoji: "🍽", isAvailable: true })
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm(item)
  }

  async function submit() {
    if (!form.name) return alert("Name is required")
    if (editing) {
      const res = await fetch(`/api/menu/${editing.id}`, {
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
      const res = await fetch(`/api/menu`, {
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
    if (!confirm("Delete this item?")) return
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
    if (res.ok) fetchList()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bengali text-lg font-bold">Menu Items</h3>
          <p className="text-sm text-gray-500">Create, edit or delete menu items</p>
        </div>
        <div>
          <button onClick={openCreate} className="rounded-md bg-[#B22222] px-3 py-2 text-sm font-semibold text-white">
            New Item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#F3E5D8] bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#F3E5D8] text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="px-4 py-3 font-mono text-xs">{it.id}</td>
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.category}</td>
                  <td className="px-4 py-3 text-right">৳{it.price}</td>
                  <td className="px-4 py-3">{it.isAvailable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(it)} className="rounded px-2 py-1 text-xs border">
                        Edit
                      </button>
                      <button onClick={() => remove(it.id)} className="rounded px-2 py-1 text-xs border text-red-600">
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

      {/* Simple form */}
      <div className="rounded-lg border border-[#F3E5D8] bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="font-bengali font-bold">{editing ? "Edit Item" : "Create Item"}</h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="rounded border px-3 py-2"
          />
          <select
            value={form.category || "All Dishes"}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            className="rounded border px-3 py-2"
          >
            {menuCategories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={form.price ?? 0}
            onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
            className="rounded border px-3 py-2"
          />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <input
            placeholder="Emoji"
            value={form.emoji || ""}
            onChange={(e) => setForm((s) => ({ ...s, emoji: e.target.value }))}
            className="rounded border px-3 py-2 max-w-xs"
          />
          <textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            className="rounded border px-3 py-2"
          />
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isAvailable}
              onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))}
            />{" "}
            Available
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={submit} className="rounded-md bg-[#B22222] px-3 py-2 text-white">
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
