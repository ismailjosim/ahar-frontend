"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertCircle, Plus, Edit3, Trash2, Calendar, HardDrive, RefreshCw } from "lucide-react"

import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
} from "@/services/inventory/inventoryService"

// --- 1. TYPE INTERFACES ---
export interface InventoryAudit {
  id: string
  itemId: string
  details: string
  createdAt: Date
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string | null
  stock: number
  unit: string
  threshold: number
  supplier: string | null
  unitCost: number
  lastRestocked: Date | null
  audits: InventoryAudit[]
  createdAt: Date
  updatedAt: Date
}

// Flat string helper type optimized for state manipulation across HTML text/date fields
interface InventoryFormState {
  name: string
  category: string
  sku: string
  stock: number
  unit: string
  threshold: number
  supplier: string
  unitCost: number
  lastRestocked: string // Kept as string for direct HTML YYYY-MM-DD tag integration
}

const emptyForm: InventoryFormState = {
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
  const [form, setForm] = useState<InventoryFormState>(emptyForm)
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
    } catch (error) {
      setUpdatingStock(null)
    }
  }

  async function submit() {
    setErrors({})

    // Transform local string entries cleanly into proper typed inputs expected by your back-end schema
    const payload = {
      ...form,
      sku: form.sku.trim() === "" ? null : form.sku,
      supplier: form.supplier.trim() === "" ? null : form.supplier,
      lastRestocked: form.lastRestocked ? new Date(form.lastRestocked) : null,
    }

    const result = editing ? await updateInventoryItem(editing.id, payload) : await createInventoryItem(payload)

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

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditing(item)
    // Convert pure DB Date values safely into YYYY-MM-DD input formats
    setForm({
      name: item.name,
      category: item.category,
      sku: item.sku || "",
      stock: item.stock,
      unit: item.unit,
      threshold: item.threshold,
      supplier: item.supplier || "",
      unitCost: item.unitCost,
      lastRestocked: item.lastRestocked ? new Date(item.lastRestocked).toISOString().slice(0, 10) : "",
    })
    setErrors({})
    setIsEditorOpen(true)
  }

  // Calculate live low stock tracking arrays
  const low = items
    .filter((i) => i.stock <= i.threshold)
    .map((i) => ({
      item: i.name,
      category: i.category || "Kitchen",
      stock: `${i.stock} ${i.unit}`,
      severity: i.stock <= 5 ? ("critical" as const) : ("warning" as const),
    }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
        {/* LEFT INVENTORY MAIN WORKSPACE CARD */}
        <div className="xl:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Inventory Items</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage live system stock tracking, thresholds, suppliers, costs, and audits.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditing(null)
                  setForm(emptyForm)
                  setErrors({})
                  setIsEditorOpen(true)
                }}
                size="sm"
                className="gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Item
              </Button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs font-semibold text-muted-foreground animate-pulse flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Loading active inventory ledger...
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-bold uppercase tracking-wider bg-muted/20">
                      <th className="px-4 py-3.5">Item Properties</th>
                      <th className="px-4 py-3.5">SKU No.</th>
                      <th className="px-4 py-3.5 text-right">Stock Vol</th>
                      <th className="px-4 py-3.5">Supplier Profile</th>
                      <th className="px-4 py-3.5 text-right">Control Triggers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center font-medium text-muted-foreground">
                          No active inventory system products found.
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => {
                        const isLowStock = it.stock <= it.threshold
                        return (
                          <tr
                            key={it.id}
                            className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div>
                                  <div className="font-bold text-sm text-card-foreground">{it.name}</div>
                                  <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                                    {it.category} • Min Threshold: {it.threshold} • ৳{it.unitCost}/{it.unit}
                                  </div>
                                </div>
                                {isLowStock && (
                                  <Badge
                                    variant={it.stock === 0 ? "destructive" : "default"}
                                    className={`text-[9px] px-1.5 py-0 font-bold tracking-wide ${
                                      it.stock > 0 && "bg-amber-500 hover:bg-amber-500 text-black"
                                    }`}
                                  >
                                    {it.stock === 0 ? "Out" : "Low"}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] tracking-tight">{it.sku || "N/A"}</td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {it.stock}{" "}
                              <span className="text-muted-foreground font-medium text-[10px]">{it.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground font-medium">{it.supplier || "N/A"}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="number"
                                  min="0"
                                  value={stockInputs[it.id] ?? it.stock}
                                  onChange={(e) =>
                                    setStockInputs((prev) => ({
                                      ...prev,
                                      [it.id]: parseInt(e.target.value, 10) || 0,
                                    }))
                                  }
                                  className="w-16 h-7 text-xs px-2"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => handleUpdateStock(it.id)}
                                  disabled={updatingStock === it.id}
                                  className="h-7 px-2 text-[11px] cursor-pointer"
                                >
                                  {updatingStock === it.id ? "..." : "Stock"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenEditModal(it)}
                                  className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                                  title="Edit Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(it.id)}
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE PANEL ACCESSIBILITY SIDEBAR */}
        <aside className="space-y-4 w-full">
          {/* Low Stock Panel Wrapper */}
          <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
            </h4>
            <div className="space-y-2">
              {low.length === 0 ? (
                <p className="text-xs text-muted-foreground font-medium py-2">
                  All product quantities are within normal baseline thresholds.
                </p>
              ) : (
                low.map((l, index) => (
                  <div
                    key={`${l.item}-${index}`}
                    className={`rounded-xl p-3 border ${
                      l.severity === "critical"
                        ? "bg-destructive/15 border-destructive/20 text-destructive dark:text-red-400"
                        : "bg-amber-500/15 border-amber-500/20 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <div className="font-bold text-xs">{l.item}</div>
                    <div className="text-[11px] font-medium mt-0.5">{l.stock} remaining inside storage</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fixed Audit Log Panel */}
          {editing && !isEditorOpen && editing.audits && editing.audits.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs animate-in fade-in duration-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                <HardDrive className="w-4 h-4 text-primary" /> Active System Audit History
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {editing.audits.map((entry) => (
                  <div key={entry.id} className="rounded-lg bg-muted/60 p-2.5 border border-border/40 text-[11px]">
                    <p className="font-semibold text-card-foreground/90">{entry.details}</p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="w-3 h-3" /> {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* SYSTEM CREATION/MUTATION DIALOG FORM */}
      {isEditorOpen && (
        <DashboardModal
          title={editing ? "Edit Inventory Product" : "Create New Inventory Registry"}
          onClose={() => {
            setEditing(null)
            setForm(emptyForm)
            setErrors({})
            setIsEditorOpen(false)
          }}
          widthClass="max-w-4xl"
        >
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <InventoryInput
              label="Product Name"
              value={form.name}
              error={errors.name}
              onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />
            <InventoryInput
              label="Category"
              value={form.category}
              error={errors.category}
              onChange={(v) => setForm((s) => ({ ...s, category: v }))}
            />
            <InventoryInput
              label="SKU Reference Code"
              value={form.sku}
              error={errors.sku}
              onChange={(v) => setForm((s) => ({ ...s, sku: v }))}
            />
            <InventoryInput
              label="Supplier Title"
              value={form.supplier}
              error={errors.supplier}
              onChange={(v) => setForm((s) => ({ ...s, supplier: v }))}
            />
            <InventoryInput
              label="Live Stock Vol"
              type="number"
              value={String(form.stock)}
              error={errors.stock}
              onChange={(v) => setForm((s) => ({ ...s, stock: Number(v) }))}
            />
            <InventoryInput
              label="Measurement Unit"
              value={form.unit}
              error={errors.unit}
              onChange={(v) => setForm((s) => ({ ...s, unit: v }))}
            />
            <InventoryInput
              label="Warning Threshold"
              type="number"
              value={String(form.threshold)}
              error={errors.threshold}
              onChange={(v) => setForm((s) => ({ ...s, threshold: Number(v) }))}
            />
            <InventoryInput
              label="Unit Production Cost"
              type="number"
              value={String(form.unitCost)}
              error={errors.unitCost}
              onChange={(v) => setForm((s) => ({ ...s, unitCost: Number(v) }))}
            />
            <InventoryInput
              label="Last Restocked Date"
              type="date"
              value={form.lastRestocked}
              error={errors.lastRestocked}
              onChange={(v) => setForm((s) => ({ ...s, lastRestocked: v }))}
            />
          </div>

          {/* Sub-Modal Audit Tracking Trail display */}
          {editing && editing.audits && editing.audits.length > 0 && (
            <div className="mt-5 rounded-xl border border-border/80 bg-muted/20 p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Item Action Log</h5>
              <div className="grid gap-2 text-[11px] max-h-36 overflow-y-auto sm:grid-cols-2">
                {editing.audits.map((entry) => (
                  <div key={entry.id} className="rounded-md bg-background p-2 border border-border/40">
                    <p className="font-medium text-card-foreground">{entry.details}</p>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null)
                setForm(emptyForm)
                setErrors({})
                setIsEditorOpen(false)
              }}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={submit} className="text-xs font-bold px-5 cursor-pointer">
              Save Registry Changes
            </Button>
          </div>
        </DashboardModal>
      )}
    </div>
  )
}

// --- 3. REUSABLE ATOMIC INPUT SUB-COMPONENT ---
interface InventoryInputProps {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
  error?: string
}

function InventoryInput({ label, onChange, type = "text", value, error }: InventoryInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-xs h-9 focus-visible:ring-primary/20 ${
          error ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : ""
        }`}
      />
      {error && <p className="text-[10px] text-destructive font-semibold tracking-tight mt-0.5">{error}</p>}
    </div>
  )
}
