"use client"

/**
 * ClearFiltersButton.tsx
 *
 * A small "Clear filters" button — only visible when at least one filter is
 * active.  Pass `isActive` to control visibility.
 *
 * Usage:
 *   <ClearFiltersButton
 *     isActive={!!search || !!status}
 *     onClear={() => { setSearch(""); setStatus("") }}
 *   />
 */

import { FilterX } from "lucide-react"

interface ClearFiltersButtonProps {
  isActive: boolean
  onClear: () => void
  label?: string
}

export default function ClearFiltersButton({ isActive, onClear, label = "Clear filters" }: ClearFiltersButtonProps) {
  if (!isActive) return null

  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <FilterX className="size-4" />
      {label}
    </button>
  )
}
