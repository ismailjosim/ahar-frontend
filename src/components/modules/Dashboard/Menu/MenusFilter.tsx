"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { menuCategories } from "@/lib/menu.constant"
import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/components/hooks/useDebounce"

const selectClass =
  "rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 h-9"

const STOCK_OPTIONS = [
  { value: "", label: "All Stock" },
  { value: "in_stock", label: "In Stock" },
  { value: "limited", label: "Limited" },
  { value: "out_of_stock", label: "Out of Stock" },
]

const AVAILABILITY_OPTIONS = [
  { value: "", label: "All Items" },
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
]

const MenusFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL so filters persist on refresh / back-nav
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [category, setCategory] = useState(searchParams.get("category") ?? "")
  const [stockStatus, setStockStatus] = useState(searchParams.get("stockStatus") ?? "")
  const [isAvailable, setIsAvailable] = useState(searchParams.get("isAvailable") ?? "")

  const debouncedSearch = useDebounce(search, 400)

  const categoryOptions = menuCategories.filter((c) => c.slug !== "all")
  const hasActiveFilters = !!(debouncedSearch || category || stockStatus || isAvailable)

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (category) params.set("category", category)
    if (stockStatus) params.set("stockStatus", stockStatus)
    if (isAvailable) params.set("isAvailable", isAvailable)

    // Replace so the back button doesn't cycle through every keystroke
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [debouncedSearch, category, stockStatus, isAvailable, router])

  const handleReset = () => {
    setSearch("")
    setCategory("")
    setStockStatus("")
    setIsAvailable("")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
        <Input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 w-52"
        />
      </div>

      {/* Category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
        <option value="">All Categories</option>
        {categoryOptions.map((c) => (
          <option key={c.slug} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Stock Status */}
      <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className={selectClass}>
        {STOCK_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Availability */}
      <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value)} className={selectClass}>
        {AVAILABILITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 gap-1.5">
          <X className="size-4" />
          Reset
        </Button>
      )}
    </div>
  )
}

export default MenusFilter
