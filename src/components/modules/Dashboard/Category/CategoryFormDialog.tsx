"use client"

import InputFieldError from "@/components/shared/InputFieldError"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import Image from "next/image"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { createCategory, updateCategory } from "@/services/category/categoriesManagement"
import { Category } from "@/types/category.interface"

const textareaClass =
  "w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24 resize-y"

interface ICategoryFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  category?: Category
}

const CategoryFormDialog = ({ open, onClose, onSuccess, category }: ICategoryFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!category?.id

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateCategory.bind(null, category.id) : createCategory,
    null,
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      if (fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(file)
        fileInputRef.current.files = dt.files
      }
    }
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Operation successful")
      formRef.current?.reset()
      setSelectedFile(null)
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
  }, [state, selectedFile, onSuccess, onClose])

  const handleClose = () => {
    formRef.current?.reset()
    setSelectedFile(null)
    onClose()
  }

  const fd = state?.formData

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Category Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Biryani"
                  defaultValue={fd?.name || category?.name || ""}
                />
                <InputFieldError field="name" state={state} />
              </Field>

              <Field>
                <FieldLabel htmlFor="icon">Icon</FieldLabel>
                <Input
                  id="icon"
                  name="icon"
                  placeholder="🍛 or icon name"
                  defaultValue={fd?.icon || category?.icon || ""}
                />
                <InputFieldError field="icon" state={state} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                name="description"
                placeholder="Short description of this category"
                defaultValue={fd?.description || category?.description || ""}
                className={textareaClass}
              />
              <InputFieldError field="description" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="file">
                Category Image
                {isEdit && <span className="ml-1 font-normal text-muted-foreground">(upload to replace)</span>}
              </FieldLabel>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer min-h-48 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile || category?.image ? (
                  <div className="flex flex-col items-center gap-3 w-full pointer-events-none">
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-border shadow-sm bg-background">
                      <Image
                        src={selectedFile ? URL.createObjectURL(selectedFile) : category!.image!}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground max-w-xs truncate">
                        {selectedFile ? selectedFile.name : "Current Image"}
                      </p>
                      <p className="text-xs text-muted-foreground">Drag and drop or click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 stroke-muted-foreground/70 group-hover:stroke-primary transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Drag & drop your image here, or{" "}
                        <span className="text-primary underline underline-offset-2">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG or WebP</p>
                    </div>
                  </div>
                )}
              </div>

              <InputFieldError field="file" state={state} />
            </Field>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-muted/50">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormDialog
