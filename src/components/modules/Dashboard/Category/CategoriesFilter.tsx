"use client"
import ClearFiltersButton from "@/components/shared/ClearFiltersButton"
import RefreshButton from "@/components/shared/RefreshButton"
import SearchFilter from "@/components/shared/SearchFilter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

const CategoriesFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const handleFilterChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(param, value)
    params.set("page", "1")
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.set("page", "1")
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }
  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SearchFilter paramName="searchTerm" placeholder="Search categories..." />
          {/* add filter option based on status active/inactive */}
          <Select onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <ClearFiltersButton />
        </div>
        <RefreshButton />
      </div>
    </div>
  )
}

export default CategoriesFilter
