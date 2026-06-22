/**
 * ManagementTable.tsx
 *
 * Generic table wrapper for admin management listings.
 * Accepts typed column definitions and row data; renders a consistent,
 * scrollable, striped table with an empty-state message.
 *
 * Usage:
 *   const columns: TableColumn<MenuItem>[] = [
 *     { key: "name", header: "Name", render: (row) => row.name },
 *     { key: "price", header: "Price", render: (row) => `৳${row.price}` },
 *   ]
 *   <ManagementTable columns={columns} rows={items} rowKey={(r) => r.id} />
 */

import type { ReactNode } from "react"

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface ManagementTableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
}

export default function ManagementTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyMessage = "No records found.",
}: ManagementTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card text-card-foreground">
      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-b border-border last:border-0 hover:bg-muted/40">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
