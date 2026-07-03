"use client"
import RefreshButton from "@/components/shared/RefreshButton"
import SearchFilter from "@/components/shared/SearchFilter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useDebounce } from "../../../hooks/useDebounce"

// ======================================================
// Types
// ======================================================

type CategoryStatus = "ACTIVE" | "INACTIVE"
type StatusSelectValue = CategoryStatus | "all"

interface CategoriesFilterProps {
  categories: CategoryStatus[]
}

const isCategoryStatus = (value: string): value is CategoryStatus => value === "ACTIVE" || value === "INACTIVE"

// Human-readable labels for each status value
const STATUS_LABELS: Record<CategoryStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
}

const CategoriesFilter = ({ categories }: CategoriesFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [statusInput, setStatusInput] = useState<CategoryStatus | "">(() => {
    const param = searchParams.get("status")
    return param && isCategoryStatus(param) ? param : ""
  })

  const debouncedStatus = useDebounce<CategoryStatus | "">(statusInput, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update debounced fields
    if (debouncedStatus) {
      params.set("status", debouncedStatus)
    } else {
      params.delete("status")
    }

    // Reset to page 1 when filters change
    params.set("page", "1")

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStatus])

  const clearAllFilters = (): void => {
    setStatusInput("")
    startTransition(() => {
      router.push(window.location.pathname)
    })
  }

  const handleStatusChange = (value: StatusSelectValue): void => {
    setStatusInput(value === "all" ? "" : value)
  }

  const activeFiltersCount: number = (statusInput ? 1 : 0) + (searchParams.get("searchTerm") ? 1 : 0)

  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search categories..." />
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls */}
      <div className="flex items-center gap-3">
        {/* Status Filter */}
        <Select
          value={statusInput || "all"}
          onValueChange={(value) => handleStatusChange(value as StatusSelectValue)}
          disabled={isPending}
        >
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {categories.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} disabled={isPending} className="h-10 px-3">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  )
}

export default CategoriesFilter
