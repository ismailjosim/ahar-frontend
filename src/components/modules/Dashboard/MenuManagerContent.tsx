"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import type { MenuAddOn, MenuItem, MenuVariant } from "@/types/menu.interface"
import { menuCategories } from "@/lib/menu.constant"

// ─── tiny form-field wrapper ────────────────────────────────────────────────

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}

function Field({ label, required, hint, error, children, className = "" }: FieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] font-semibold text-destructive">{error}</p>}
    </div>
  )
}

// ─── validation ─────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<string, string>>

function validateForm(form: Partial<MenuItem>): FormErrors {
  const errors: FormErrors = {}

  if (!form.name?.trim()) {
    errors.name = "Item name is required."
  } else if (form.name.trim().length > 120) {
    errors.name = "Name must be 120 characters or less."
  }

  if (!form.category || form.category === "All Dishes") {
    errors.category = "Please select a specific category."
  }

  if (!form.price || form.price <= 0) {
    errors.price = "Price must be greater than ৳0."
  } else if (form.price > 99999) {
    errors.price = "Price seems too high — maximum is ৳99,999."
  }

  return errors
}

// ─── main component ──────────────────────────────────────────────────────────

export default function MenuManagerContent() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<Partial<MenuItem>>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch(`/api/menu?page=${page}&pageSize=${pageSize}&isAvailable=`)
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
    setImageFile(null)
    setErrors({})
    setForm({
      name: "",
      description: "",
      category: "",
      price: 0,
      emoji: "🍽",
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
    setImageFile(null)
    setErrors({})
    setIsEditorOpen(true)
  }

  function closeEditor() {
    setEditing(null)
    setForm({})
    setErrors({})
    setImageFile(null)
    setIsEditorOpen(false)
  }

  // Clear a single field error when the user starts typing
  function clearError(field: string) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function setField<K extends keyof MenuItem>(key: K, value: MenuItem[K]) {
    setForm((s) => ({ ...s, [key]: value }))
    clearError(key)
  }

  async function submit() {
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSaving(true)

    const url = editing ? `/api/menu/${editing.id}` : `/api/menu`
    const method = editing ? "PATCH" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const saved = await res.json().catch(() => null)
        const savedId = saved?.data?.id ?? saved?.id ?? editing?.id

        if (imageFile && savedId) {
          const fd = new FormData()
          fd.append("image", imageFile)
          await fetch(`/api/menu/${savedId}/image`, { method: "POST", body: fd }).catch(() => null)
        }

        await fetchList()
        closeEditor()
      } else {
        const body = await res.json().catch(() => null)
        setErrors({ _submit: body?.message || body?.error || "Unable to save menu item." })
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
    if (res.ok) await fetchList()
  }

  const inputClass =
    "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

  const inputErrorClass =
    "w-full rounded-md border border-destructive bg-destructive/5 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-destructive focus:ring-2 focus:ring-destructive/20"

  const buttonClass =
    "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"

  const outlineButtonClass =
    "rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"

  function fieldClass(field: string) {
    return errors[field] ? inputErrorClass : inputClass
  }

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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-2">{it.emoji}</span>
                    {it.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{it.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">৳{it.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">⭐ {it.rating?.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        it.isAvailable ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {it.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
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
        <DashboardModal title={editing ? "Edit Item" : "Create Item"} onClose={closeEditor} widthClass="max-w-4xl">
          {/* ── Row 1: core identity ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Item Name" required error={errors.name} className="sm:col-span-2">
              <input
                placeholder="e.g. Royal Mutton Kacchi Biryani"
                value={form.name || ""}
                onChange={(e) => setField("name", e.target.value)}
                className={fieldClass("name")}
                maxLength={120}
              />
            </Field>

            <Field label="Category" required error={errors.category}>
              <select
                value={form.category || ""}
                onChange={(e) => setField("category", e.target.value)}
                className={fieldClass("category")}
              >
                <option value="" disabled>
                  Select category…
                </option>
                {menuCategories
                  .filter((c) => c.slug !== "all")
                  .map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </Field>
          </div>

          {/* ── Row 2: pricing & display ── */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Price (BDT)" required error={errors.price}>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-muted-foreground">
                  ৳
                </span>
                <input
                  type="number"
                  placeholder="0"
                  min={1}
                  max={99999}
                  step={1}
                  value={form.price ?? ""}
                  onChange={(e) => setField("price", Number(e.target.value))}
                  className={`${fieldClass("price")} pl-7`}
                />
              </div>
            </Field>

            <Field label="Prep Time" hint='e.g. "35 min" or "Ready"'>
              <input
                placeholder="25 min"
                value={form.prepTime || ""}
                onChange={(e) => setField("prepTime", e.target.value)}
                className={inputClass}
                maxLength={30}
              />
            </Field>

            <Field label="Emoji" hint="Single emoji">
              <input
                placeholder="🍽"
                value={form.emoji || ""}
                onChange={(e) => setField("emoji", e.target.value)}
                className={inputClass}
                maxLength={4}
              />
            </Field>
          </div>

          {/* ── Row 3: media & description ── */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Menu Image" hint="Upload replaces the existing image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className={`${inputClass} cursor-pointer`}
              />
              {imageFile && <p className="text-[11px] text-muted-foreground">Selected: {imageFile.name}</p>}
              {!imageFile && form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Current image"
                  className="mt-2 h-16 w-16 rounded-xl border border-border object-cover"
                />
              )}
            </Field>

            <Field label="Description">
              <textarea
                placeholder="Short description of the dish — ingredients, cooking style, flavour…"
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                maxLength={500}
              />
            </Field>
          </div>

          {/* ── Row 4: tags & extras ── */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Field label="Tags" hint="Comma-separated — e.g. Signature, Popular, Halal">
              <input
                placeholder="Signature, Popular, Halal"
                value={(form.tags || []).join(", ")}
                onChange={(e) => setField("tags", parseList(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Variants" hint="Format: Name:price-markup — e.g. Regular:0, Large:120, Family Pack:360">
              <input
                placeholder="Regular:0, Large:120"
                value={formatVariants(form.variants || [])}
                onChange={(e) => setField("variants", parseVariants(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Add-ons" hint="Format: Name:price — e.g. Extra Mutton:140, Borhani:80">
              <input
                placeholder="Extra Mutton:140, Borhani:80"
                value={formatAddOns(form.addOns || [])}
                onChange={(e) => setField("addOns", parseAddOns(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>

          {/* ── Row 5: flags ── */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item Flags</p>
            <div className="flex flex-wrap gap-4">
              {(
                [
                  { key: "isFeatured", label: "Featured on home page" },
                  { key: "isSpicy", label: "Spicy" },
                  { key: "isAvailable", label: "Currently available" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form[key]}
                    onChange={(e) => setField(key, e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* ── submit-level error ── */}
          {errors._submit && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
              {errors._submit}
            </div>
          )}

          {/* ── actions ── */}
          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
            <button onClick={submit} disabled={isSaving} className={buttonClass}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Create Item"}
            </button>
            <button onClick={closeEditor} className={outlineButtonClass}>
              Cancel
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  )
}

// ─── helpers ────────────────────────────────────────────────────────────────

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
  return variants.map((v) => `${v.name}:${v.markup}`).join(", ")
}

function formatAddOns(addOns: MenuAddOn[]) {
  return addOns.map((a) => `${a.name}:${a.price}`).join(", ")
}
