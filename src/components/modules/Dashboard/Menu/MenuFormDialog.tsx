"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { createMenuItem, updateMenuItem } from "@/services/menu/menusManagement"

import InputFieldError from "@/components/shared/InputFieldError"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { Category } from "@/types/category.interface"
import type { MenuItem } from "@/types/menu.interface"

const textareaClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm outline-none transition min-h-24 resize-y"

const inputClass = "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm outline-none transition"

interface MenuFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  menuItem?: MenuItem
  categories: Category[]
}

interface Variant {
  name: string
  price: number
}

interface AddOn {
  name: string
  price: number
}

export default function MenuFormDialog({ open, onClose, onSuccess, menuItem, categories }: MenuFormDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(menuItem)

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateMenuItem.bind(null, menuItem!.id) : createMenuItem,
    null,
  )

  const fd = state?.formData

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [tags, setTags] = useState<string[]>(menuItem?.tags ?? [])
  const [tagInput, setTagInput] = useState("")

  const [variants, setVariants] = useState<Variant[]>(
    menuItem?.variants?.length
      ? menuItem.variants
      : [
          {
            name: "Regular",
            price: menuItem?.price ?? 0,
          },
        ],
  )

  const [addOns, setAddOns] = useState<AddOn[]>(menuItem?.addOns ?? [])

  useEffect(() => {
    if (!open) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTags(menuItem?.tags ?? [])

    setVariants(
      menuItem?.variants?.length
        ? menuItem.variants
        : [
            {
              name: "Regular",
              price: menuItem?.price ?? 0,
            },
          ],
    )

    setAddOns(menuItem?.addOns ?? [])

    setSelectedFile(null)
  }, [menuItem, open])

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message)

      formRef.current?.reset()

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null)
      setTags([])
      setVariants([
        {
          name: "Regular",
          price: 0,
        },
      ])
      setAddOns([])

      onSuccess()
      onClose()

      return
    }

    if (!state.success && state.message) {
      toast.error(state.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const preview = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile)
    }

    return menuItem?.imageUrl
  }, [selectedFile, menuItem])

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleClose = () => {
    formRef.current?.reset()

    setSelectedFile(null)
    setTags([])
    setTagInput("")
    setVariants([
      {
        name: "Regular",
        price: 0,
      },
    ])
    setAddOns([])

    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) return

    setSelectedFile(file)

    if (fileInputRef.current) {
      const dt = new DataTransfer()

      dt.items.add(file)

      fileInputRef.current.files = dt.files
    }
  }

  const addTag = () => {
    const value = tagInput.trim()

    if (!value) return

    if (tags.includes(value)) return

    setTags([...tags, value])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        price: 0,
      },
    ])
  }

  const updateVariant = (index: number, key: keyof Variant, value: string | number) => {
    const copy = [...variants]

    copy[index] = {
      ...copy[index],
      [key]: value,
    }

    setVariants(copy)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addAddOn = () => {
    setAddOns([
      ...addOns,
      {
        name: "",
        price: 0,
      },
    ])
  }

  const updateAddOn = (index: number, key: keyof AddOn, value: string | number) => {
    const copy = [...addOns]

    copy[index] = {
      ...copy[index],
      [key]: value,
    }

    setAddOns(copy)
  }

  const removeAddOn = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index))
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{isEdit ? "Edit Menu Item" : "Create Menu Item"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {/* ============================= */}
            {/* Basic Information */}
            {/* ============================= */}

            <section className="space-y-5">
              <div>
                <h3 className="font-semibold">Basic Information</h3>

                <p className="text-sm text-muted-foreground">General information about this menu item.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Menu Name *</FieldLabel>

                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Spicy Chicken Burger"
                    defaultValue={fd?.name ?? menuItem?.name ?? ""}
                  />

                  <InputFieldError field="name" state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="categoryId">Category *</FieldLabel>

                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue={fd?.categoryId ?? menuItem?.categoryId ?? ""}
                    className={inputClass}
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <InputFieldError field="categoryId" state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className={textareaClass}
                  placeholder="Describe the menu item..."
                  defaultValue={fd?.description ?? menuItem?.description ?? ""}
                />

                <InputFieldError field="description" state={state} />
              </Field>
            </section>

            {/* ============================= */}
            {/* Pricing */}
            {/* ============================= */}

            <section className="space-y-5">
              <div>
                <h3 className="font-semibold">Pricing & Details</h3>

                <p className="text-sm text-muted-foreground">Configure pricing and preparation time.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="price">Base Price *</FieldLabel>

                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    placeholder="12.99"
                    defaultValue={fd?.price ?? menuItem?.price ?? ""}
                  />

                  <InputFieldError field="price" state={state} />
                </Field>

                {/* <Field>
                  <FieldLabel htmlFor="rating">Rating *</FieldLabel>

                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    required
                    min={0}
                    max={5}
                    step="0.1"
                    placeholder="4.8"
                    defaultValue={fd?.rating ?? menuItem?.rating ?? 5}
                  />

                  <InputFieldError field="rating" state={state} />
                </Field> */}

                <Field>
                  <FieldLabel htmlFor="prepTime">Preparation Time *</FieldLabel>

                  <Input
                    id="prepTime"
                    name="prepTime"
                    required
                    placeholder="15-20 min"
                    defaultValue={fd?.prepTime ?? menuItem?.prepTime ?? ""}
                  />

                  <InputFieldError field="prepTime" state={state} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    value="true"
                    defaultChecked={menuItem?.isAvailable ?? true}
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="font-medium">Available</p>

                    <p className="text-xs text-muted-foreground">Visible to customers</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="true"
                    defaultChecked={menuItem?.isFeatured ?? false}
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="font-medium">Featured</p>

                    <p className="text-xs text-muted-foreground">Highlight on homepage</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    value="true"
                    defaultChecked={menuItem?.isSpicy ?? false}
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="font-medium">Spicy</p>

                    <p className="text-xs text-muted-foreground">Show spicy badge</p>
                  </div>
                </label>
              </div>
            </section>
            {/* ============================= */}
            {/* Tags */}
            {/* ============================= */}

            <section className="space-y-5">
              <div>
                <h3 className="font-semibold">Tags</h3>
                <p className="text-sm text-muted-foreground">Add searchable tags for this menu item.</p>
              </div>

              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  placeholder="Burger"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />

                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-sm">
                      {tag}

                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input hidden readOnly name="tags" value={JSON.stringify(tags)} />
            </section>

            {/* ============================= */}
            {/* Variants */}
            {/* ============================= */}

            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Variants</h3>

                  <p className="text-sm text-muted-foreground">Example: Regular, Large, Family.</p>
                </div>

                <Button type="button" variant="outline" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>

              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-[1fr_180px_48px]">
                    <Input
                      placeholder="Variant Name"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                    />

                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                    />

                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <input hidden readOnly name="variants" value={JSON.stringify(variants)} />
            </section>

            {/* ============================= */}
            {/* Add-ons */}
            {/* ============================= */}

            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Add-ons</h3>

                  <p className="text-sm text-muted-foreground">Optional extras customers can add.</p>
                </div>

                <Button type="button" variant="outline" onClick={addAddOn}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Add-on
                </Button>
              </div>

              <div className="space-y-3">
                {addOns.map((item, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-[1fr_180px_48px]">
                    <Input
                      placeholder="Add-on Name"
                      value={item.name}
                      onChange={(e) => updateAddOn(index, "name", e.target.value)}
                    />

                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateAddOn(index, "price", Number(e.target.value))}
                    />

                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAddOn(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <input hidden readOnly name="addOns" value={JSON.stringify(addOns)} />
            </section>
            {/* ============================= */}
            {/* Image */}
            {/* ============================= */}

            <section className="space-y-5">
              <div>
                <h3 className="font-semibold">Menu Image</h3>

                <p className="text-sm text-muted-foreground">Upload the menu image shown to customers.</p>
              </div>

              <Field>
                <FieldLabel htmlFor="file">
                  Image
                  {isEdit && (
                    <span className="ml-2 text-muted-foreground font-normal">(Leave empty to keep current image)</span>
                  )}
                </FieldLabel>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`cursor-pointer rounded-xl border-2 border-dashed transition p-8 ${
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />

                  {preview ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative h-56 w-full max-w-sm overflow-hidden rounded-xl border">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized={preview.startsWith("blob:")}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground">Click or drag another image to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5M16 8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>

                      <div className="text-center">
                        <p className="font-medium">Drag & Drop your image here</p>

                        <p className="text-sm text-muted-foreground">or click to browse</p>
                      </div>

                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>

                <InputFieldError field="file" state={state} />
              </Field>
            </section>
          </div>

          {/* Footer */}

          <div className="border-t bg-background px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={isPending} onClick={handleClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Menu Item" : "Create Menu Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
