"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import type { InventoryItem } from "@/lib/inventory.store"
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
} from "@/services/inventory/inventoryService"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

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
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({})
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function fetchList() {
    setLoading(true)
    const result = await getInventoryItems()
    if (result.success) {
      setItems(result.data || [])
    } else {
      toast.error(result.message || "Failed to load inventory items")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [])

  async function handleUpdateStock(id: string) {
    const newStock = stockInputs[id]
    if (newStock === undefined) return

    setUpdatingStock(id)
    try {
      const result = await updateInventoryStock(id, newStock)
      if (result.success) {
        toast.success(result.message || "Stock updated successfully")
        fetchList()
        setStockInputs((prev) => {
          const updated = { ...prev }
          delete updated[id]
          return updated
        })
      } else {
        toast.error(result.message || "Failed to update stock")
      }
    } finally {
      setUpdatingStock(null)
    }
  }

  async function submit() {
    setErrors({})
    const result = editing 
      ? await updateInventoryItem(editing.id, form)
      : await createInventoryItem(form)

    if (result.success) {
      toast.success(result.message || "Operation successful")
      setEditing(null)
      setForm(emptyForm)
      setIsEditorOpen(false)
      fetchList()
    } else {
      if (result.errors) {
        setErrors(result.errors)
      }
      toast.error(result.message || "Failed to save inventory item")
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this inventory item?")) return
    const result = await deleteInventoryItem(id)
    if (result.success) {
      toast.success(result.message || "Item deleted successfully")
      fetchList()
    } else {
      toast.error(result.message || "Failed to delete item")
    }
  }

  // Calculate low stock alerts dynamically from database state
  const low = items
    .filter((i) => i.stock <= i.threshold)
    .map((i) => ({
      item: i.name,
      category: i.category || "Kitchen",
      stock: `${i.stock} ${i.unit}`,
      severity: i.stock <= 5 ? "critical" : "warning",
    }))

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
                  setErrors({})
                  setIsEditorOpen(true)
                }}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
              >
                New Item
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-muted-foreground">Loading inventory items...</div>
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
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    items.map((it) => {
                      const isLowStock = it.stock <= it.threshold
                      return (
                        <tr key={it.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-bold">{it.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {it.category} • threshold {it.threshold} • ৳{it.unitCost}/{it.unit}
                                </div>
                              </div>
                              {isLowStock && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    it.stock === 0
                                      ? "bg-destructive/20 text-destructive"
                                      : "bg-amber-500/20 text-amber-600 dark:text-amber-500"
                                  }`}
                                >
                                  {it.stock === 0 ? "Out" : "Low"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{it.sku || "N/A"}</td>
                          <td className="px-4 py-3 text-right">
                            {it.stock} {it.unit}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{it.supplier || "N/A"}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={stockInputs[it.id] ?? it.stock}
                                onChange={(e) =>
                                  setStockInputs((prev) => ({
                                    ...prev,
                                    [it.id]: parseInt(e.target.value, 10) || 0,
                                  }))
                                }
                                className="w-16 rounded border border-border bg-background px-2 py-1 text-xs"
                              />
                              <button
                                onClick={() => handleUpdateStock(it.id)}
                                disabled={updatingStock === it.id}
                                className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50 transition"
                              >
                                {updatingStock === it.id ? "..." : "Update"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditing(it)
                                  setForm(it)
                                  setErrors({})
                                  setIsEditorOpen(true)
                                }}
                                className="rounded border border-border px-2 py-1 text-xs hover:bg-muted transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => remove(it.id)}
                                className="rounded border border-border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
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
                    className={`rounded-xl p-3 ${
                      l.severity === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                    }`}
                  >
                    <div className="font-bold">{l.item}</div>
                    <div className="text-xs">{l.stock} remaining</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {editing && !isEditorOpen && editing.history && editing.history.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm">
              <h4 className="font-bengali text-md font-bold">Stock History</h4>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                {editing.history.map((entry, index) => (
                  <div key={index} className="rounded-lg bg-muted/50 p-2">
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
            setErrors({})
            setIsEditorOpen(false)
          }}
          widthClass="max-w-5xl"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InventoryInput
              label="Name"
              value={form.name || ""}
              error={errors.name}
              onChange={(value) => setForm((s) => ({ ...s, name: value }))}
            />
            <InventoryInput
              label="Category"
              value={form.category || ""}
              error={errors.category}
              onChange={(value) => setForm((s) => ({ ...s, category: value }))}
            />
            <InventoryInput
              label="SKU"
              value={form.sku || ""}
              error={errors.sku}
              onChange={(value) => setForm((s) => ({ ...s, sku: value }))}
            />
            <InventoryInput
              label="Supplier"
              value={form.supplier || ""}
              error={errors.supplier}
              onChange={(value) => setForm((s) => ({ ...s, supplier: value }))}
            />
            <InventoryInput
              label="Stock"
              type="number"
              value={String(form.stock ?? 0)}
              error={errors.stock}
              onChange={(value) => setForm((s) => ({ ...s, stock: Number(value) }))}
            />
            <InventoryInput
              label="Unit"
              value={form.unit || ""}
              error={errors.unit}
              onChange={(value) => setForm((s) => ({ ...s, unit: value }))}
            />
            <InventoryInput
              label="Threshold"
              type="number"
              value={String(form.threshold ?? 0)}
              error={errors.threshold}
              onChange={(value) => setForm((s) => ({ ...s, threshold: Number(value) }))}
            />
            <InventoryInput
              label="Unit Cost"
              type="number"
              value={String(form.unitCost ?? 0)}
              error={errors.unitCost}
              onChange={(value) => setForm((s) => ({ ...s, unitCost: Number(value) }))}
            />
            <InventoryInput
              label="Last Restocked"
              type="date"
              value={form.lastRestocked || ""}
              error={errors.lastRestocked}
              onChange={(value) => setForm((s) => ({ ...s, lastRestocked: value }))}
            />
          </div>
          {editing && editing.history && editing.history.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
              <h5 className="font-bengali text-sm font-bold">Stock History</h5>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {editing.history.map((entry, index) => (
                  <div key={index} className="rounded-lg bg-background p-2">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={submit}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setForm(emptyForm)
                setErrors({})
                setIsEditorOpen(false)
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition"
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
  error,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
  error?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className={`${inputClass} ${error ? "border-destructive focus:ring-destructive/20 focus:border-destructive" : ""}`}
      />
      {error && <p className="text-[11px] text-destructive font-medium mt-1">{error}</p>}
    </div>
  )
}
