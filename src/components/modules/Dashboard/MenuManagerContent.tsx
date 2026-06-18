"use client"

import { useEffect, useState } from "react"
import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import type { MenuAddOn, MenuItem, MenuVariant } from "@/types/menu.interface"
import { menuCategories } from "@/lib/menu.constant"

export default function MenuManagerContent() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<Partial<MenuItem>>({})
  const [isEditorOpen, setIsEditorOpen] = useState(false)

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function openCreate() {
    setEditing(null)
    setForm({
      name: "",
      description: "",
      category: "All Dishes",
      price: 0,
      emoji: "🍽",
      rating: 4.5,
      prepTime: "25 min",
      tags: [],
      variants: [],
      addOns: [],
      isFeatured: false,
      isSpicy: false,
      isAvailable: true,
    })
    setIsEditorOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({ ...item })
    setIsEditorOpen(true)
  }

  async function submit() {
    if (!form.name) return alert("Name is required")
    if (Number(form.price || 0) <= 0) return alert("Price must be greater than 0")

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
      setIsEditorOpen(false)
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

      {isEditorOpen && (
        <DashboardModal
          title={editing ? "Edit Item" : "Create Item"}
          onClose={() => {
            setEditing(null)
            setForm({})
            setIsEditorOpen(false)
          }}
          widthClass="max-w-4xl"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

            <input
              placeholder="Preparation time"
              value={form.prepTime || ""}
              onChange={(e) => setForm((s) => ({ ...s, prepTime: e.target.value }))}
              className={inputClass}
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating ?? 4.5}
              onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))}
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

            <input
              placeholder="Tags, comma separated"
              value={(form.tags || []).join(", ")}
              onChange={(e) => setForm((s) => ({ ...s, tags: parseList(e.target.value) }))}
              className={inputClass}
            />

            <input
              placeholder="Variants: Regular:0, Large:120"
              value={formatVariants(form.variants || [])}
              onChange={(e) => setForm((s) => ({ ...s, variants: parseVariants(e.target.value) }))}
              className={inputClass}
            />

            <input
              placeholder="Add-ons: Extra Beef:90, Borhani:80"
              value={formatAddOns(form.addOns || [])}
              onChange={(e) => setForm((s) => ({ ...s, addOns: parseAddOns(e.target.value) }))}
              className={inputClass}
            />

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.isFeatured}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    isFeatured: e.target.checked,
                  }))
                }
                className="size-4 accent-primary"
              />
              Featured
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.isSpicy}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    isSpicy: e.target.checked,
                  }))
                }
                className="size-4 accent-primary"
              />
              Spicy
            </label>

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
                setIsEditorOpen(false)
              }}
              className={outlineButtonClass}
            >
              Cancel
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  )
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseVariants(value: string): MenuVariant[] {
  return parseList(value).map((item) => {
    const [name, markup = "0"] = item.split(":")
    return { name: name.trim(), markup: Number(markup) || 0 }
  })
}

function parseAddOns(value: string): MenuAddOn[] {
  return parseList(value).map((item) => {
    const [name, price = "0"] = item.split(":")
    return { name: name.trim(), price: Number(price) || 0 }
  })
}

function formatVariants(variants: MenuVariant[]) {
  return variants.map((variant) => `${variant.name}:${variant.markup}`).join(", ")
}

function formatAddOns(addOns: MenuAddOn[]) {
  return addOns.map((addOn) => `${addOn.name}:${addOn.price}`).join(", ")
}
