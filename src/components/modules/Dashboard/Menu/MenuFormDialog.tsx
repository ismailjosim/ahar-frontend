import InputFieldError from "@/components/shared/InputFieldError"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { Allergen, MenuItem } from "@/types/menu.interface"
import { menuCategories } from "@/lib/menu.constant"
import { createMenuItem, updateMenuItem } from "@/services/menu/menusManagement"

// ── Constants ────────────────────────────────────────────────────────────────

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

const DIETARY_FLAGS = [
  { name: "isHalal", label: "Halal" },
  { name: "isVegetarian", label: "Vegetarian" },
  { name: "isVegan", label: "Vegan" },
  { name: "isGlutenFree", label: "Gluten-Free" },
  { name: "isSpicy", label: "Spicy" },
] as const

const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "limited", label: "Limited Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
]

const selectClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

const textareaClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24 resize-y"

// ── Component ─────────────────────────────────────────────────────────────────

interface IMenuFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  menuItem?: MenuItem
}

const MenuFormDialog = ({ open, onClose, onSuccess, menuItem }: IMenuFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!menuItem?.id

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateMenuItem.bind(null, menuItem.id) : createMenuItem,
    null,
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  // Handle success / error from server
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Operation successful")
      if (formRef.current) {
        formRef.current.reset()
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null)
      onSuccess()
      onClose()
    } else if (state?.message && !state.success) {
      toast.error(state.message)
      // Restore file to input after error so user doesn't have to re-pick
      if (selectedFile && fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(selectedFile)
        fileInputRef.current.files = dataTransfer.files
      }
    }
  }, [state, onClose, onSuccess, selectedFile])

  const handleClose = () => {
    setSelectedFile(null)
    formRef.current?.reset()
    onClose()
  }

  const categoryOptions = menuCategories.filter((c) => c.slug !== "all").map((c) => ({ label: c.name, value: c.name }))

  // After a failed submission prefer state values so the user's input survives
  const fd = state?.formData

  const currentAllergens = (fd?.allergens as Allergen[] | undefined) ?? menuItem?.allergens ?? []

  const variantsDefault = fd?.variants
    ? (fd.variants as Array<{ name: string; markup: number }>).map((v) => `${v.name}:${v.markup}`).join(", ")
    : (menuItem?.variants?.map((v) => `${v.name}:${v.markup}`).join(", ") ?? "")

  const addOnsDefault = fd?.addOns
    ? (fd.addOns as Array<{ name: string; price: number }>).map((a) => `${a.name}:${a.price}`).join(", ")
    : (menuItem?.addOns?.map((a) => `${a.name}:${a.price}`).join(", ") ?? "")

  const tagsDefault = fd?.tags ? (fd.tags as string[]).join(", ") : (menuItem?.tags?.join(", ") ?? "")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            {/* ── Core Identity ───────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel htmlFor="name">Item Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Royal Mutton Kacchi Biryani"
                    defaultValue={fd?.name || menuItem?.name || ""}
                  />
                  <InputFieldError field="name" state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="auto-generated if empty"
                  defaultValue={fd?.slug || menuItem?.slug || ""}
                />
                <p className="text-xs text-muted-foreground mt-1">Leave blank to auto-generate</p>
                <InputFieldError field="slug" state={state} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Ingredients, cooking style, flavour profile…"
                    defaultValue={fd?.description || menuItem?.description || ""}
                    maxLength={500}
                    className={textareaClass}
                  />
                  <InputFieldError field="description" state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  name="category"
                  defaultValue={fd?.category || menuItem?.category || ""}
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

            {/* ── Pricing ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="price">Base Price (BDT)</FieldLabel>
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
                    defaultValue={fd?.price || menuItem?.price || ""}
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
                    placeholder="—"
                    min={0}
                    max={99999}
                    step={1}
                    defaultValue={fd?.discountPrice || menuItem?.discountPrice || ""}
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
                    defaultValue={fd?.discountPercent || menuItem?.discountPercent || ""}
                    className="pr-7"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-bold text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">e.g. 10 for 10% off</p>
              </Field>
            </div>

            {/* ── Media & Display ─────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field>
                  <FieldLabel htmlFor="file">
                    Menu Image
                    {isEdit && <span className="ml-1 font-normal text-muted-foreground">(upload to replace)</span>}
                  </FieldLabel>

                  {/* Preview: new file takes priority, then existing imageUrl */}
                  {(selectedFile || menuItem?.imageUrl) && (
                    <div className="mb-2 flex items-center gap-3">
                      <Image
                        src={selectedFile ? URL.createObjectURL(selectedFile) : menuItem!.imageUrl!}
                        alt="Preview"
                        width={72}
                        height={72}
                        className="rounded-lg border border-border object-cover"
                      />
                      {selectedFile ? (
                        <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Current image — kept unless replaced</p>
                      )}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploaded to Cloudinary. JPG, PNG, or WebP recommended.
                  </p>
                  <InputFieldError field="file" state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  placeholder="0"
                  min={0}
                  step={1}
                  defaultValue={fd?.sortOrder !== undefined ? (fd.sortOrder as number) : (menuItem?.sortOrder ?? 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">Lower = shown first</p>
              </Field>
            </div>

            {/* ── Nutrition & Prep ────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <Field>
                <FieldLabel htmlFor="prepTime">Prep Time</FieldLabel>
                <Input
                  id="prepTime"
                  name="prepTime"
                  placeholder="25 min"
                  defaultValue={fd?.prepTime || menuItem?.prepTime || ""}
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
                  defaultValue={fd?.calories || menuItem?.nutrition?.calories || ""}
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
                  defaultValue={fd?.protein || menuItem?.nutrition?.protein || ""}
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
                  defaultValue={fd?.carbs || menuItem?.nutrition?.carbs || ""}
                />
              </Field>

              {/* fat was missing from the original form — server action already reads it */}
              <Field>
                <FieldLabel htmlFor="fat">Fat (g)</FieldLabel>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  placeholder="0"
                  min={0}
                  defaultValue={fd?.fat || menuItem?.nutrition?.fat || ""}
                />
              </Field>
            </div>

            {/* ── Dietary Suitability ─────────────────────────────── */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Dietary Suitability</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {DIETARY_FLAGS.map(({ name, label }) => (
                  <label key={name} className="inline-flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={name}
                      defaultChecked={(fd?.[name] as boolean | undefined) ?? menuItem?.[name] ?? false}
                      className="size-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Allergens ───────────────────────────────────────── */}
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
              <InputFieldError field="allergens" state={state} />
            </div>

            {/* ── Customisation ───────────────────────────────────── */}
            <Field>
              <FieldLabel htmlFor="variants">Variants</FieldLabel>
              <Input
                id="variants"
                name="variants"
                placeholder="Regular:0, Large:120, Family Pack:360"
                defaultValue={variantsDefault}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: Name:price-markup — e.g. Regular:0, Large:120
              </p>
              <InputFieldError field="variants" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="addOns">Add-ons</FieldLabel>
              <Input
                id="addOns"
                name="addOns"
                placeholder="Extra Mutton:140, Borhani:80"
                defaultValue={addOnsDefault}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: Name:price — e.g. Extra Mutton:140, Borhani:80
              </p>
              <InputFieldError field="addOns" state={state} />
            </Field>

            {/* ── Discovery & Status ──────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="tags">Tags</FieldLabel>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Signature, Popular, Chef Special"
                  defaultValue={tagsDefault}
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated — e.g. Signature, Popular, Halal</p>
              </Field>

              <Field>
                <FieldLabel htmlFor="stockStatus">Stock Status</FieldLabel>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  defaultValue={fd?.stockStatus || menuItem?.stockStatus || "in_stock"}
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
                    defaultChecked={(fd?.[name] as boolean | undefined) ?? menuItem?.[name] ?? name === "isAvailable"}
                    className="size-4 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* ── Form Actions ──────────────────────────────────────── */}
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
