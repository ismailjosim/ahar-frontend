"use client"

/**
 * TablePagination.tsx
 *
 * Prev / Next pagination control for management tables.
 *
 * Usage:
 *   <TablePagination
 *     page={page}
 *     pageSize={20}
 *     total={total}
 *     onPageChange={setPage}
 *   />
 */

import { ChevronLeft, ChevronRight } from "lucide-react"

interface TablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function TablePagination({ page, pageSize, total, onPageChange }: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {start}–{end}
            </span>{" "}
            of <span className="font-semibold text-foreground">{total}</span>
          </>
        ) : (
          "No records"
        )}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
