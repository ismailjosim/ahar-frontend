"use client"
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"
import ManagementTable from "@/components/shared/ManagementTable"

import { deleteCategory } from "@/services/category/categoriesManagement"

import type { Category } from "@/types/category.interface"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import CategoryFormDialog from "./CategoryFormDialog"
import CategoryViewDetailsDialog from "./CategoryViewDetailsDialog"
import { categoriesColumns } from "./categoriesColumns"

interface CategoriesTableProps {
  categories: Category[]
}

const CategoriesTable = ({ categories }: CategoriesTableProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  const handleView = (category: Category) => {
    setViewingCategory(category)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
  }

  const handleDelete = (category: Category) => {
    setDeletingCategory(category)
  }

  const confirmDelete = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)
    const result = await deleteCategory(deletingCategory.id)
    setIsDeleting(false)

    if (result?.success) {
      toast.success(result.message || "Category deleted successfully")
      setDeletingCategory(null)
      handleRefresh()
    } else {
      toast.error(result?.message || "Failed to delete category")
    }
  }

  return (
    <>
      <ManagementTable
        data={categories}
        columns={categoriesColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(category) => category.id}
        emptyMessage="No categories found"
      />

      {/* Edit Category Form Dialog */}
      <CategoryFormDialog
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory!}
        onSuccess={() => {
          setEditingCategory(null)
          handleRefresh()
        }}
      />

      {/* View Category Detail Dialog */}
      <CategoryViewDetailsDialog
        open={!!viewingCategory}
        onClose={() => setViewingCategory(null)}
        category={viewingCategory}
      />

      {/* Delete Confirmation Dialog */}
      {/* <DeleteConfirmationDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete ${deletingCategory?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      /> */}
    </>
  )
}

export default CategoriesTable
