"use client"

import { useEffect, useState } from "react"
import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import type { InventoryItem } from "@/lib/inventory.store"
import { lowStockItems } from "@/lib/inventory.store"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

const emptyForm: Partial<InventoryItem> = {
  name: "",
  category: "Kitchen",
  sku: "",
  stock: 0,
  unit: "pcs",
  threshold: 10,
  supplier: "",
  unitCost: 0,
  lastRestocked: new Date().toISOString().slice(0, 10),
}

export default function InventoryManagerContent() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [form, setForm] = useState<Partial<InventoryItem>>(emptyForm)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  async function fetchList() {
    setLoading(true)
    const res = await fetch(`/api/inventory`)
    const body = await res.json()
    setItems(body.data || [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList()
  }, [])

  async function setStock(id: string, value: number) {
    const res = await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: value }),
    })
    if (res.ok) fetchList()
  }

  async function submit() {
    if (!form.name?.trim()) return alert("Inventory item name is required")
    const res = await fetch(editing ? `/api/inventory/${editing.id}` : "/api/inventory", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setEditing(null)
      setForm(emptyForm)
      setIsEditorOpen(false)
      fetchList()
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this inventory item?")) return
    const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" })
    if (res.ok) fetchList()
  }

  const low = lowStockItems()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="overflow-x-auto rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bengali text-lg font-bold">Inventory Items</h3>
                <p className="text-sm text-muted-foreground">
                  Manage stock, thresholds, suppliers, cost, and audit history.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditing(null)
                  setForm(emptyForm)
                  setIsEditorOpen(true)
                }}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                New Item
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-bold">{it.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {it.category} • threshold {it.threshold} • ৳{it.unitCost}/{it.unit}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{it.sku}</td>
                      <td className="px-4 py-3 text-right">
                        {it.stock} {it.unit}
                      </td>
                      <td className="px-4 py-3">{it.supplier}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setStock(it.id, Math.max(0, it.stock - 1))}
                            className="rounded border border-border px-2 py-1 text-xs"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => setStock(it.id, it.stock + 1)}
                            className="rounded border border-border px-2 py-1 text-xs"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => {
                              setEditing(it)
                              setForm(it)
                              setIsEditorOpen(true)
                            }}
                            className="rounded border border-border px-2 py-1 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(it.id)}
                            className="rounded border border-border px-2 py-1 text-xs text-destructive"
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
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm">
            <h4 className="font-bengali text-md font-bold">Low Stock Alerts</h4>
            <div className="mt-3 space-y-2">
              {low.length === 0 ? (
                <div className="text-sm text-muted-foreground">No low stock items</div>
              ) : (
                low.map((l) => (
                  <div
                    key={l.item}
                    className={`rounded-xl p-3 ${l.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning-soft text-warning-foreground"}`}
                  >
                    <div className="font-bold">{l.item}</div>
                    <div className="text-xs">{l.stock}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {editing && !isEditorOpen && (
            <div className="rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm">
              <h4 className="font-bengali text-md font-bold">Stock History</h4>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                {editing.history.map((entry) => (
                  <div key={entry} className="rounded-lg bg-muted/50 p-2">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {isEditorOpen && (
        <DashboardModal
          title={editing ? "Edit Inventory Item" : "Create Inventory Item"}
          onClose={() => {
            setEditing(null)
            setForm(emptyForm)
            setIsEditorOpen(false)
          }}
          widthClass="max-w-5xl"
        >
          <div className="grid gap-3 md:grid-cols-4">
            <InventoryInput
              label="Name"
              value={form.name || ""}
              onChange={(value) => setForm((s) => ({ ...s, name: value }))}
            />
            <InventoryInput
              label="Category"
              value={form.category || ""}
              onChange={(value) => setForm((s) => ({ ...s, category: value }))}
            />
            <InventoryInput
              label="SKU"
              value={form.sku || ""}
              onChange={(value) => setForm((s) => ({ ...s, sku: value }))}
            />
            <InventoryInput
              label="Supplier"
              value={form.supplier || ""}
              onChange={(value) => setForm((s) => ({ ...s, supplier: value }))}
            />
            <InventoryInput
              label="Stock"
              type="number"
              value={String(form.stock ?? 0)}
              onChange={(value) => setForm((s) => ({ ...s, stock: Number(value) }))}
            />
            <InventoryInput
              label="Unit"
              value={form.unit || ""}
              onChange={(value) => setForm((s) => ({ ...s, unit: value }))}
            />
            <InventoryInput
              label="Threshold"
              type="number"
              value={String(form.threshold ?? 0)}
              onChange={(value) => setForm((s) => ({ ...s, threshold: Number(value) }))}
            />
            <InventoryInput
              label="Unit Cost"
              type="number"
              value={String(form.unitCost ?? 0)}
              onChange={(value) => setForm((s) => ({ ...s, unitCost: Number(value) }))}
            />
            <InventoryInput
              label="Last Restocked"
              type="date"
              value={form.lastRestocked || ""}
              onChange={(value) => setForm((s) => ({ ...s, lastRestocked: value }))}
            />
          </div>
          {editing && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
              <h5 className="font-bengali text-sm font-bold">Stock History</h5>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {editing.history.map((entry) => (
                  <div key={entry} className="rounded-lg bg-background p-2">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={submit}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setForm(emptyForm)
                setIsEditorOpen(false)
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  )
}

function InventoryInput({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} className={inputClass} />
    </label>
  )
}
