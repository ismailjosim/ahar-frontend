"use client"

/**
 * SearchFilter.tsx
 *
 * Text-based search input with a clear button.
 *
 * Usage:
 *   <SearchFilter value={search} onChange={setSearch} placeholder="Search items…" />
 */

import { Search, X } from "lucide-react"

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchFilter({ value, onChange, placeholder = "Search…", className = "" }: SearchFilterProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-input bg-muted/50 py-2 pl-10 pr-9 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
