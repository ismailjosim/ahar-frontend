"use client"

import { Badge } from "@/components/ui/badge"
import { Column } from "@/components/shared/ManagementTable"
import { DateCell } from "@/components/shared/Cell/DateCell"
import type { Category, CategoryStatus } from "@/types/category.interface"
import Image from "next/image"
import { cn } from "@/lib/utils"

// primary === apply when status is inactive
// success === apply when status is active
// accent === apply when status is archived

const STATUS_BADGE_MAP: Record<
  CategoryStatus,
  {
    label: string
    variant: "Active" | "Inactive" | "Archived"
  }
> = {
  ACTIVE: {
    label: "Active",
    variant: "Active",
  },
  INACTIVE: {
    label: "Inactive",
    variant: "Inactive",
  },
  ARCHIVED: {
    label: "Archived",
    variant: "Archived",
  },
}

export const categoriesColumns: Column<Category>[] = [
  {
    header: "#",
    accessor: (_category, index) => <span className="text-muted-foreground">{index + 1}</span>,
  },
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
      return (
        <Badge
          variant={"default"}
          className={cn(
            variant === "Active" && "bg-success hover:bg-success/80",
            variant === "Archived" && "bg-accent hover:bg-accent/80",
            variant === "Inactive" && "bg-primary hover:bg-primary/80",
          )}
        >
          {label}
        </Badge>
      )
    },
    sortKey: "status",
  },
  {
    header: "Created At",
    accessor: (category) => <DateCell date={category.createdAt} />,
    sortKey: "createdAt",
  },
  {
    header: "Updated At",
    accessor: (category) => <DateCell date={category.updatedAt} />,
    sortKey: "updatedAt",
  },
]
