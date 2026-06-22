"use client"

/**
 * SelectFilter.tsx
 *
 * Dropdown filter — accepts a list of label/value pairs and calls onChange
 * when the user makes a selection.
 *
 * Usage:
 *   const options = [
 *     { label: "All", value: "" },
 *     { label: "Active", value: "active" },
 *     { label: "Inactive", value: "inactive" },
 *   ]
 *   <SelectFilter
 *     value={status}
 *     onChange={setStatus}
 *     options={options}
 *     placeholder="All Statuses"
 *   />
 */

export interface SelectOption {
  label: string
  value: string
}

interface SelectFilterProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function SelectFilter({
  value,
  onChange,
  options,
  placeholder = "All",
  className = "",
}: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
