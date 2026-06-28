"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MenuItem } from "@/types/menu.interface"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import MenuFormDialog from "./CategoryFormDialog"
import MenuViewDetailsDialog from "./MenuViewDetailsDialog"
import { menusColumns } from "./menusColumn"
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"
import { deleteMenuItem } from "@/services/menu/menusManagement"

interface MenusTableProps {
  menuItems: MenuItem[]
}

const MenusTable = ({ menuItems }: MenusTableProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRefresh = () => {
    startTransition(() => router.refresh())
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

  const columns = menusColumns({
    onEdit: setEditingItem,
    onView: setViewingItem,
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
        description="This action cannot be undone. The item will be permanently removed."
        isDeleting={isDeleting}
      />
    </>
  )
}

export default MenusTable
