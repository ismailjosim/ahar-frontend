"use client"

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteMenuItem } from "@/services/menu/menusManagement"
import type { MenuItem } from "@/types/menu.interface"
import type { Category } from "@/types/category.interface"

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import MenuFormDialog from "./MenuFormDialog"
import MenuViewDetailsDialog from "./MenuViewDetailsDialog"
import { menuColumns } from "./menusColumn"

interface MenuTableProps {
  menuItems: MenuItem[]
  categories: Category[]
}

const MenuTable = ({ menuItems, categories }: MenuTableProps) => {
  const router = useRouter()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)
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
    if (!deletingItem) return

    setIsDeleting(true)

    const result = await deleteMenuItem(deletingItem.id)

    setIsDeleting(false)

    if (result?.success) {
      toast.success(result.message || "Menu item deleted successfully")

      setDeletingItem(null)
      handleRefresh()
    } else {
      toast.error(result?.message || "Failed to delete menu item")
    }
  }

  const columns = menuColumns({
    onEdit: setEditingItem,
    onView: setViewingItem,
    onDelete: setDeletingItem,
    onRefresh: handleRefresh,
  })

  const table = useReactTable({
    data: menuItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit */}
      <MenuFormDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        menuItem={editingItem!}
        categories={categories}
        onSuccess={() => {
          setEditingItem(null)
          handleRefresh()
        }}
      />

      {/* View */}
      <MenuViewDetailsDialog open={!!viewingItem} onClose={() => setViewingItem(null)} menuItem={viewingItem} />

      {/* Hard Delete confirmation */}
      <DeleteConfirmationDialog
        isOpen={!!deletingItem}
        onCancel={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        itemName={deletingItem?.name}
        description="This action cannot be undone. The menu item will be permanently removed."
        isDeleting={isDeleting}
      />
    </>
  )
}

export default MenuTable
