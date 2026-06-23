"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"

import InputFieldError from "@/components/shared/InputFieldError"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Allergen, MenuItem } from "@/types/menu.interface"
import { menuCategories } from "@/lib/menu.constant"
import { createMenuItem, updateMenuItem } from "@/services/menu/menusManagement"
import { toast } from "sonner"

// ─── constants ────────────────────────────────────────────────────────────────

const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: "gluten", label: "Gluten" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "nuts", label: "Nuts" },
  { value: "peanuts", label: "Peanuts" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
  { value: "mustard", label: "Mustard" },
]

const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "limited", label: "Limited Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
]

const selectClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

const textareaClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24 resize-y"

// ─── section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        {children}
      </p>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ─── props ────────────────────────────────────────────────────────────────────

interface IMenuFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  menuItem?: MenuItem
}

// ─── component ────────────────────────────────────────────────────────────────

const MenuFormDialog = ({ open, onClose, onSuccess, menuItem }: IMenuFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!menuItem?.id

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateMenuItem.bind(null, menuItem?.id as string) : createMenuItem,
    null,
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null)
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Operation successful")
      formRef.current?.reset()
      onSuccess()
      onClose()
    } else if (state?.message && !state.success) {
      toast.error(state.message)
      if (selectedFile && fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(selectedFile)
        fileInputRef.current.files = dt.files
      }
    }
  }, [state, onClose, onSuccess, selectedFile])

  const handleClose = () => {
    setSelectedFile(null)
    formRef.current?.reset()
    onClose()
  }

  const categoryOptions = menuCategories.filter((c) => c.slug !== "all").map((c) => ({ label: c.name, value: c.name }))

  const currentAllergens = (state?.formData?.allergens as Allergen[]) ?? menuItem?.allergens ?? []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{isEdit ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* ── Section 1: Core Identity ─────────────────────────────── */}
            <SectionHeading>Core Identity</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel htmlFor="name">
                    Item Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Royal Mutton Kacchi Biryani"
                    defaultValue={(state?.formData?.name as string) || menuItem?.name || ""}
                  />
                  <InputFieldError field="name" state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <select
                  id="category"
                  name="category"
                  defaultValue={(state?.formData?.category as string) || menuItem?.category || ""}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select category…
                  </option>
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <InputFieldError field="category" state={state} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                name="description"
                placeholder="Short description — ingredients, cooking style, flavour profile…"
                defaultValue={(state?.formData?.description as string) || menuItem?.description || ""}
                maxLength={500}
                className={textareaClass}
              />
              <InputFieldError field="description" state={state} />
            </Field>

            {/* ── Section 2: Pricing ───────────────────────────────────── */}
            <SectionHeading>Pricing</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="price">
                  Base Price (BDT) <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-muted-foreground">
                    ৳
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    min={1}
                    max={99999}
                    step={1}
                    defaultValue={(state?.formData?.price as number) || menuItem?.price || ""}
                    className="pl-7"
                  />
                </div>
                <InputFieldError field="price" state={state} />
              </Field>

              <Field>
                <FieldLabel htmlFor="discountPrice">Discount Price (BDT)</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-muted-foreground">
                    ৳
                  </span>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={99999}
                    step={1}
                    defaultValue={(state?.formData?.discountPrice as number) || menuItem?.discountPrice || ""}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Leave empty if no discount</p>
              </Field>

              <Field>
                <FieldLabel htmlFor="discountPercent">Discount %</FieldLabel>
                <div className="relative">
                  <Input
                    id="discountPercent"
                    name="discountPercent"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={(state?.formData?.discountPercent as number) || menuItem?.discountPercent || ""}
                    className="pr-7"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-bold text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">e.g. 10 for 10% off</p>
              </Field>
            </div>

            {/* ── Section 3: Media & Display ───────────────────────────── */}
            <SectionHeading>Media & Display</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel htmlFor="file">Menu Image</FieldLabel>
                  {/* Preview */}
                  {(selectedFile || menuItem?.imageUrl) && (
                    <div className="mb-2 flex items-center gap-3">
                      <Image
                        src={selectedFile ? URL.createObjectURL(selectedFile) : menuItem!.imageUrl!}
                        alt="Preview"
                        width={72}
                        height={72}
                        className="rounded-lg border border-border object-cover"
                      />
                      {selectedFile && <p className="text-xs text-muted-foreground">{selectedFile.name}</p>}
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload replaces the existing image</p>
                  <InputFieldError field="file" state={state} />
                </Field>
              </div>

              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    placeholder="0"
                    min={0}
                    step={1}
                    defaultValue={(state?.formData?.sortOrder as number) ?? menuItem?.sortOrder ?? 0}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower = shown first</p>
                </Field>
              </div>
            </div>

            {/* ── Section 4: Nutrition & Prep ──────────────────────────── */}
            <SectionHeading>Nutrition & Prep</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="prepTime">Prep Time</FieldLabel>
                <Input
                  id="prepTime"
                  name="prepTime"
                  placeholder="25 min"
                  defaultValue={(state?.formData?.prepTime as string) || menuItem?.prepTime || ""}
                />
                <p className="text-xs text-muted-foreground mt-1">&quot;35 min&quot; or &quot;Ready&quot;</p>
              </Field>

              <Field>
                <FieldLabel htmlFor="calories">Calories (kcal)</FieldLabel>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  placeholder="0"
                  min={0}
                  defaultValue={(state?.formData?.calories as number) || menuItem?.nutrition?.calories || ""}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="protein">Protein (g)</FieldLabel>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  placeholder="0"
                  min={0}
                  defaultValue={(state?.formData?.protein as number) || menuItem?.nutrition?.protein || ""}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="carbs">Carbs (g)</FieldLabel>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  placeholder="0"
                  min={0}
                  defaultValue={(state?.formData?.carbs as number) || menuItem?.nutrition?.carbs || ""}
                />
              </Field>
            </div>

            {/* ── Section 5: Dietary & Allergens ───────────────────────── */}
            <SectionHeading>Dietary & Allergens</SectionHeading>

            <div className="space-y-4">
              {/* Dietary checkboxes */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Dietary Suitability</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {(
                    [
                      { name: "isHalal", label: "Halal" },
                      { name: "isVegetarian", label: "Vegetarian" },
                      { name: "isVegan", label: "Vegan" },
                      { name: "isGlutenFree", label: "Gluten-Free" },
                      { name: "isSpicy", label: "Spicy" },
                    ] as const
                  ).map(({ name, label }) => (
                    <label key={name} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name={name}
                        defaultChecked={(state?.formData?.[name] as boolean) ?? menuItem?.[name] ?? false}
                        className="size-4 accent-primary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Contains Allergens</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {ALLERGEN_OPTIONS.map(({ value, label }) => (
                    <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="allergens"
                        value={value}
                        defaultChecked={currentAllergens.includes(value)}
                        className="size-4 accent-destructive"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 6: Customization ─────────────────────────────── */}
            <SectionHeading>Customization</SectionHeading>

            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="variants">Variants</FieldLabel>
                <Input
                  id="variants"
                  name="variants"
                  placeholder="Regular:0, Large:120, Family Pack:360"
                  defaultValue={
                    state?.formData?.variants
                      ? (state.formData.variants as Array<{ name: string; markup: number }>)
                          .map((v) => `${v.name}:${v.markup}`)
                          .join(", ")
                      : menuItem?.variants?.map((v) => `${v.name}:${v.markup}`).join(", ") || ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: Name:price-markup — e.g. Regular:0, Large:120
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="addOns">Add-ons</FieldLabel>
                <Input
                  id="addOns"
                  name="addOns"
                  placeholder="Extra Mutton:140, Borhani:80"
                  defaultValue={
                    state?.formData?.addOns
                      ? (state.formData.addOns as Array<{ name: string; price: number }>)
                          .map((a) => `${a.name}:${a.price}`)
                          .join(", ")
                      : menuItem?.addOns?.map((a) => `${a.name}:${a.price}`).join(", ") || ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: Name:price — e.g. Extra Mutton:140, Borhani:80
                </p>
              </Field>
            </div>

            {/* ── Section 7: Discovery & Status ────────────────────────── */}
            <SectionHeading>Discovery & Status</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tags">Tags</FieldLabel>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Signature, Popular, Chef Special"
                  defaultValue={
                    state?.formData?.tags
                      ? (state.formData.tags as string[]).join(", ")
                      : menuItem?.tags?.join(", ") || ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated — e.g. Signature, Popular, Halal</p>
              </Field>

              <Field>
                <FieldLabel htmlFor="stockStatus">Stock Status</FieldLabel>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  defaultValue={(state?.formData?.stockStatus as string) || menuItem?.stockStatus || "in_stock"}
                  className={selectClass}
                >
                  {STOCK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {(
                [
                  { name: "isFeatured", label: "Featured on home page" },
                  { name: "isAvailable", label: "Currently available" },
                ] as const
              ).map(({ name, label }) => (
                <label key={name} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={name}
                    defaultChecked={(state?.formData?.[name] as boolean) ?? menuItem?.[name] ?? name === "isAvailable"}
                    className="size-4 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-muted/50">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MenuFormDialog
