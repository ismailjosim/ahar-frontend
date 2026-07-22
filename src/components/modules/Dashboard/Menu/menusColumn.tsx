import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { MenuItem } from "@/types/menu.interface"

interface Props {
  onEdit: (item: MenuItem) => void
  onView: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onRefresh: () => void
}

export const menuColumns = ({ onEdit, onView, onDelete }: Props): ColumnDef<MenuItem>[] => [
  {
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.imageUrl}
        alt={row.original.name}
        width={56}
        height={56}
        className="rounded-md object-cover w-14 h-14"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => row.original.category?.name,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => `⭐ ${row.original.rating}`,
  },
  {
    accessorKey: "prepTime",
    header: "Prep Time",
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) =>
      row.original.isAvailable ? <Badge>Available</Badge> : <Badge variant="destructive">Unavailable</Badge>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button size="icon" variant="ghost" onClick={() => onView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={() => onEdit(row.original)}>
          <Pencil className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={() => onDelete(row.original)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
]
