/**
 * TableSkeleton.tsx
 *
 * Animated skeleton placeholder displayed while a management table is loading.
 *
 * Usage:
 *   {isLoading ? <TableSkeleton rows={5} cols={6} /> : <ManagementTable … />}
 */

interface TableSkeletonProps {
  rows?: number
  cols?: number
}

function SkeletonCell({ wide }: { wide?: boolean }) {
  return <div className={`h-3.5 animate-pulse rounded bg-muted ${wide ? "w-32" : "w-20"}`} />
}

export default function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header skeleton */}
      <div className="flex gap-6 border-b border-border px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 w-16 animate-pulse rounded bg-muted" />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-6 border-b border-border px-4 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonCell key={colIdx} wide={colIdx === 0} />
          ))}
        </div>
      ))}
    </div>
  )
}
