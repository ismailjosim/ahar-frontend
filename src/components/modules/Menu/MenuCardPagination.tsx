"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MenuCardPaginationProps {
  currentPage: number
  totalPages: number
}

const MenuCardPagination = ({ currentPage, totalPages }: MenuCardPaginationProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }

  const changeLimit = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", newLimit)
    params.set("page", "1") // Reset to page 1 to avoid blank page indexes on larger limits

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }

  // Fallback defaults to 9 matching your requirements
  const currentLimit = searchParams.get("limit") || "9"

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-xs w-full">
      {/* Active Page Info State Indicator */}
      <span className="text-xs font-semibold text-muted-foreground order-2 sm:order-1">
        Showing Page {currentPage} of {totalPages || 1}
      </span>

      {/* Primary Arrow Navigation Container */}
      <div className="flex items-center justify-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="h-9 px-3 text-xs font-medium cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1 stroke-[2.5]" />
          Prev
        </Button>

        {/* Dynamic Numbered Button Triggers */}
        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNumber: number

            if (totalPages <= 5) {
              pageNumber = index + 1
            } else if (currentPage <= 3) {
              pageNumber = index + 1
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index
            } else {
              pageNumber = currentPage - 2 + index
            }

            return (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToPage(pageNumber)}
                disabled={isPending}
                className="w-9 h-9 font-bold text-xs cursor-pointer"
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="h-9 px-3 text-xs font-medium cursor-pointer"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1 stroke-[2.5]" />
        </Button>
      </div>

      {/* Grid Limits Configurator Select Dropdown */}
      <div className="flex items-center gap-2.5 order-3">
        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Items per page:</span>
        <Select value={currentLimit} onValueChange={changeLimit} disabled={isPending}>
          <SelectTrigger className="w-20 h-9 text-xs font-semibold bg-background cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="bg-card">
            <SelectItem value="1" className="text-xs cursor-pointer">
              1
            </SelectItem>
            <SelectItem value="2" className="text-xs cursor-pointer">
              2
            </SelectItem>
            <SelectItem value="9" className="text-xs cursor-pointer font-bold text-primary">
              9 (Default)
            </SelectItem>
            <SelectItem value="10" className="text-xs cursor-pointer">
              10
            </SelectItem>
            <SelectItem value="20" className="text-xs cursor-pointer">
              20
            </SelectItem>
            <SelectItem value="50" className="text-xs cursor-pointer">
              50
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default MenuCardPagination
