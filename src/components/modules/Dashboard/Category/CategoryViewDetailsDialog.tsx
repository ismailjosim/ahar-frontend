"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import type { Category } from "@/types/category.interface"
import Image from "next/image"

interface CategoryViewDetailsDialogProps {
  open: boolean
  onClose: () => void
  category: Category | null
}

const CategoryViewDetailsDialog = ({ open, onClose, category }: CategoryViewDetailsDialogProps) => {
  if (!category) return null

  const statusMap = {
    ACTIVE: {
      label: "Active",
      variant: "default" as const,
    },
    INACTIVE: {
      label: "Inactive",
      variant: "secondary" as const,
    },
    ARCHIVED: {
      label: "Archived",
      variant: "destructive" as const,
    },
  }

  const status = statusMap[category.status as keyof typeof statusMap] ?? {
    label: category.status,
    variant: "secondary" as const,
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>

          <DialogDescription>View complete information about this category.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="flex justify-center">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                width={180}
                height={180}
                className="rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{category.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-medium">{category.slug}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>

              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Icon</p>

              <p className="font-medium">{category.icon || "N/A"}</p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>

              <p className="whitespace-pre-wrap">{category.description || "No description provided."}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>

              <p className="font-medium">{new Date(category.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Updated At</p>

              <p className="font-medium">{new Date(category.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryViewDetailsDialog
