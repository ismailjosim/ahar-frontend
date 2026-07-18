"use client"

import { Badge } from "@/components/ui/badge"
import { Column } from "@/components/shared/ManagementTable"
import { DateCell } from "@/components/shared/Cell/DateCell"
import type { Category, CategoryStatus } from "@/types/category.interface"
import Image from "next/image"

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
]
