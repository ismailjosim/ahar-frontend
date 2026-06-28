import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { softDeleteMenuItem, deleteMenuItem } from "@/services/menu/menusManagement"
import type { MenuItem } from "@/types/menu.interface"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Eye, Trash2, ArchiveX } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface MenuColumnsOptions {
  onEdit: (item: MenuItem) => void
  onView: (item: MenuItem) => void
  onRefresh: () => void
}

export const menusColumns = ({ onEdit, onView, onRefresh }: MenuColumnsOptions): ColumnDef<MenuItem>[] => [
  // ── Image ───────────────────────────────────────────────────────────────────
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const item = row.original
      return item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={44}
          height={44}
          className="rounded-md border border-border object-cover"
        />
      ) : (
        <div className="size-11 rounded-md border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          N/A
        </div>
      )
    },
  },

  // ── Name & Category ─────────────────────────────────────────────────────────
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="space-y-0.5">
          <p className="font-medium text-sm leading-none">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      )
    },
  },

  // ── Price ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="space-y-0.5">
          <p className="text-sm font-medium">৳{item.price}</p>
          {item.discountPrice && <p className="text-xs text-muted-foreground line-through">৳{item.discountPrice}</p>}
        </div>
      )
    },
  },

  // ── Stock Status ────────────────────────────────────────────────────────────
  {
    accessorKey: "stockStatus",
    header: "Stock",
    cell: ({ row }) => {
      const status = row.original.stockStatus
      const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
        in_stock: { label: "In Stock", variant: "default" },
        limited: { label: "Limited", variant: "secondary" },
        out_of_stock: { label: "Out of Stock", variant: "destructive" },
      }
      const { label, variant } = map[status] ?? { label: status, variant: "secondary" }
      return <Badge variant={variant}>{label}</Badge>
    },
  },

  // ── Availability ────────────────────────────────────────────────────────────
  {
    accessorKey: "isAvailable",
    header: "Available",
    cell: ({ row }) => (
      <Badge variant={row.original.isAvailable ? "default" : "secondary"}>
        {row.original.isAvailable ? "Yes" : "No"}
      </Badge>
    ),
  },

  // ── Featured ────────────────────────────────────────────────────────────────
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <Badge variant={row.original.isFeatured ? "default" : "secondary"}>
        {row.original.isFeatured ? "Yes" : "No"}
      </Badge>
    ),
  },

  // ── Sort Order ──────────────────────────────────────────────────────────────
  {
    accessorKey: "sortOrder",
    header: "Order",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.sortOrder}</span>,
  },

  // ── Actions ─────────────────────────────────────────────────────────────────
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original

      const handleSoftDelete = async () => {
        const res = await softDeleteMenuItem(item.id)
        if (res?.success) {
          toast.success(res.message || "Item archived successfully")
          onRefresh()
        } else {
          toast.error(res?.message || "Failed to archive item")
        }
      }

      const handleHardDelete = async () => {
        const res = await deleteMenuItem(item.id)
        if (res?.success) {
          toast.success(res.message || "Item deleted permanently")
          onRefresh()
        } else {
          toast.error(res?.message || "Failed to delete item")
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSoftDelete} className="text-yellow-600 focus:text-yellow-600">
              <ArchiveX className="mr-2 size-4" />
              Archive
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleHardDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
