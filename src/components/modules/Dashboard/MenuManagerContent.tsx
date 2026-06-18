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
    try {
      const res = await fetch(`/api/menu?page=${page}&pageSize=${pageSize}`)
      const body = await res.json()
      setItems(body.data || [])
      setTotal(body.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [page])

  function openCreate() {
    setEditing(null)
    setForm({
      name: "",
      description: "",
      category: "All Dishes",
      price: 0,
      emoji: "🍽",
      isAvailable: true,
    })
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({ ...item })
  }

  async function submit() {
    if (!form.name) return alert("Name is required")

    const url = editing ? `/api/menu/${editing.id}` : `/api/menu`
    const method = editing ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      await fetchList()
      setEditing(null)
      setForm({})
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return

    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
    if (res.ok) await fetchList()
  }

  const inputClass =
    "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

  const buttonClass =
    "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"

  const outlineButtonClass =
    "rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"

  return (
    <div className="space-y-4 text-foreground">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bengali text-lg font-bold">Menu Items</h3>
          <p className="text-sm text-muted-foreground">Create, edit or delete menu items</p>
        </div>

        <button onClick={openCreate} className={buttonClass}>
          New Item
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-card-foreground">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
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
                <tr key={it.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{it.id}</td>
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3">{it.category}</td>
                  <td className="px-4 py-3 text-right">৳{it.price}</td>
                  <td className="px-4 py-3">{it.isAvailable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(it)}
                        className="rounded-md border border-border px-2 py-1 text-xs transition hover:bg-muted"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => remove(it.id)}
                        className="rounded-md border border-border px-2 py-1 text-xs text-destructive transition hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">Total: {total}</div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={outlineButtonClass}
          >
            Prev
          </button>

          <div className="text-sm text-muted-foreground">Page {page}</div>

          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className={outlineButtonClass}
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
        <h4 className="font-bengali font-bold">{editing ? "Edit Item" : "Create Item"}</h4>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className={inputClass}
          />

          <select
            value={form.category || "All Dishes"}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            className={inputClass}
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
            className={inputClass}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <input
            placeholder="Emoji"
            value={form.emoji || ""}
            onChange={(e) => setForm((s) => ({ ...s, emoji: e.target.value }))}
            className={`${inputClass} max-w-xs`}
          />

          <textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            className={`${inputClass} min-h-24 resize-y`}
          />

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.isAvailable}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  isAvailable: e.target.checked,
                }))
              }
              className="size-4 accent-primary"
            />
            Available
          </label>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button onClick={submit} className={buttonClass}>
            Save
          </button>

          <button
            onClick={() => {
              setEditing(null)
              setForm({})
            }}
            className={outlineButtonClass}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
