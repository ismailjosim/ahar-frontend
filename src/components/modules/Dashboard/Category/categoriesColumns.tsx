"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Column } from "@/components/shared/ManagementTable"
import { DateCell } from "@/components/shared/Cell/DateCell"

import { softDeleteCategory } from "@/services/category/categoriesManagement"
import type { Category, CategoryStatus } from "@/types/category.interface"

import { ArchiveX, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"

// ======================================================
// Status badge mapping
// ======================================================

const STATUS_BADGE_MAP: Record<
  CategoryStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive"
  }
> = {
  ACTIVE: {
    label: "Active",
    variant: "default",
  },
  INACTIVE: {
    label: "Inactive",
    variant: "secondary",
  },
  ARCHIVED: {
    label: "Archived",
    variant: "destructive",
  },
}

// ======================================================
// Archive cell (self-contained, like UserInfoCell/DateCell)
// ======================================================

const ArchiveCell = ({ category }: { category: Category }) => {
  const router = useRouter()

  const handleSoftDelete = async () => {
    const res = await softDeleteCategory(category.id)

    if (res?.success) {
      toast.success(res.message || "Category archived successfully")
      router.refresh()
    } else {
      toast.error(res?.message || "Failed to archive category")
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
        <DropdownMenuItem onClick={handleSoftDelete} className="text-yellow-600 focus:text-yellow-600">
          <ArchiveX className="mr-2 size-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ======================================================
// Columns
// ======================================================

export const categoriesColumns: Column<Category>[] = [
  {
    header: "Image",
    accessor: (category) =>
      category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          width={44}
          height={44}
          className="rounded-md border border-border object-cover"
        />
      ) : (
        <div className="size-11 rounded-md border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          N/A
        </div>
      ),
  },
  {
    header: "Category",
    accessor: (category) => (
      <div className="space-y-0.5">
        <p className="font-medium text-sm leading-none">{category.name}</p>
        <p className="text-xs text-muted-foreground">/{category.slug}</p>
      </div>
    ),
    sortKey: "name",
  },
  {
    header: "Status",
    accessor: (category) => {
      const { label, variant } = STATUS_BADGE_MAP[category.status]
      return <Badge variant={variant}>{label}</Badge>
    },
    sortKey: "status",
  },
  {
    header: "Created",
    accessor: (category) => <DateCell date={category.createdAt} />,
    sortKey: "createdAt",
  },
  {
    header: "Archive",
    className: "w-17.5",
    accessor: (category) => <ArchiveCell category={category} />,
  },
]
