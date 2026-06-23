"use client"

import { useMemo } from "react"
import TableSkeleton from "./TableSkeleton"

interface ManagementPageLoadingProps {
  columns: number
  hasActionButton?: boolean
  filterCount?: number
  filterWidths?: string[]
}

export function ManagementPageLoading({
  columns,
  hasActionButton = false,
  filterCount = 0,
  filterWidths = [],
}: ManagementPageLoadingProps) {
  // Memoize filter elements to prevent recreation on every render
  const filterElements = useMemo(() => {
    if (filterCount === 0) return null

    return (
      <div className="flex items-center gap-3">
        {Array.from({ length: filterCount }).map((_, index) => (
          <div
            key={index}
            className={`h-10 ${filterWidths[index] || "w-40"} bg-muted animate-pulse rounded-md border shadow-sm`}
          />
        ))}
      </div>
    )
  }, [filterCount, filterWidths])

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-md shadow-sm" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded-md shadow-sm" />
        </div>
        {hasActionButton && <div className="h-10 w-32 bg-muted animate-pulse rounded-md shadow-sm" />}
      </div>

      {/* Filters Skeleton */}
      {filterElements}

      {/* Table Skeleton */}
      <TableSkeleton cols={columns} rows={10} />
    </div>
  )
}
