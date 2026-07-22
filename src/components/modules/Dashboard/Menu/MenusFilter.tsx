"use client"
import ClearFiltersButton from "@/components/shared/ClearFiltersButton"
import RefreshButton from "@/components/shared/RefreshButton"
import SearchFilter from "@/components/shared/SearchFilter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Category } from "@/types/category.interface"

const STOCK_OPTIONS = [
  { value: "all", label: "All Stock" },
  { value: "in_stock", label: "In Stock" },
  { value: "limited", label: "Limited" },
  { value: "out_of_stock", label: "Out of Stock" },
]

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Items" },
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
]

interface MenusFilterProps {
  categories: Category[]
}

const MenusFilter = ({ categories }: MenusFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(param)
    } else {
      params.set(param, value)
    }
    params.set("page", "1")
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchFilter paramName="search" placeholder="Search items..." />

          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("stockStatus") || "all"}
            onValueChange={(value) => handleFilterChange("stockStatus", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              {STOCK_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("isAvailable") || "all"}
            onValueChange={(value) => handleFilterChange("isAvailable", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ClearFiltersButton />
        </div>
        <RefreshButton />
      </div>
    </div>
  )
}

export default MenusFilter
