'use client'

import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  deleteCategory,
} from '@/services/category/categoriesManagement'

import type { Category } from '@/types/category.interface'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useRouter } from 'next/navigation'
import {
  useRef,
  useState,
  useTransition,
} from 'react'
import { toast } from 'sonner'

import CategoryFormDialog from './CategoryFormDialog'
import CategoryViewDetailsDialog from './CategoryViewDetailsDialog'
import { categoriesColumns } from './categoriesColumns'


interface CategoriesTableProps {
  categories: Category[]
}

const CategoriesTable = ({ categories }: CategoriesTableProps) => {
  const router = useRouter()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isRefreshing = useRef(false)

  const handleRefresh = () => {
    if (isRefreshing.current) return
    isRefreshing.current = true
    router.refresh()
    setTimeout(() => {
      isRefreshing.current = false
    }, 1000)
  }


  const confirmDelete = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)

    const result =
      await deleteCategory(
        deletingCategory.id
      )

    setIsDeleting(false)

    if (result?.success) {
      toast.success(
        result.message ||
        'Category deleted successfully'
      )

      setDeletingCategory(null)
      handleRefresh()
    } else {
      toast.error(
        result?.message ||
        'Failed to delete category'
      )
    }
  }

  const columns = categoriesColumns({
    onEdit: setEditingCategory,
    onView: setViewingCategory,
    onDelete: setDeletingCategory,
    onRefresh: handleRefresh,
  })

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel:
      getCoreRowModel(),
  })

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map(
                (
                  headerGroup
                ) => (
                  <TableRow
                    key={
                      headerGroup.id
                    }
                  >
                    {headerGroup.headers.map(
                      (
                        header
                      ) => (
                        <TableHead
                          key={
                            header.id
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header
                                .column
                                .columnDef
                                .header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                )
              )}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows
              .length ? (
              table
                .getRowModel()
                .rows.map(
                  (row) => (
                    <TableRow
                      key={
                        row.id
                      }
                    >
                      {row
                        .getVisibleCells()
                        .map(
                          (
                            cell
                          ) => (
                            <TableCell
                              key={
                                cell.id
                              }
                            >
                              {flexRender(
                                cell
                                  .column
                                  .columnDef
                                  .cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        )}
                    </TableRow>
                  )
                )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length
                  }
                  className='h-32 text-center text-muted-foreground'
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit */}
      <CategoryFormDialog
        open={!!editingCategory}
        onClose={() =>
          setEditingCategory(
            null
          )
        }
        category={
          editingCategory!
        }
        onSuccess={() => {
          setEditingCategory(
            null
          )
          handleRefresh()
        }}
      />

      {/* View */}
      <CategoryViewDetailsDialog
        open={!!viewingCategory}
        onClose={() =>
          setViewingCategory(
            null
          )
        }
        category={
          viewingCategory
        }
      />

      {/* Hard Delete confirmation */}
      <DeleteConfirmationDialog
        isOpen={
          !!deletingCategory
        }
        onCancel={() =>
          setDeletingCategory(
            null
          )
        }
        onConfirm={confirmDelete}
        itemName={
          deletingCategory?.name
        }
        description='This action cannot be undone. The category will be permanently removed.'
        isDeleting={isDeleting}
      />
    </>
  )
}

export default CategoriesTable