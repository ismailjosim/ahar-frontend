/**
 * ManagementPageHeader.tsx
 *
 * Consistent header used at the top of every admin management page.
 * Provides a title, optional subtitle, and a primary action button slot.
 *
 * Usage:
 *   <ManagementPageHeader
 *     title="Menu Items"
 *     subtitle="Create, edit or remove menu items"
 *     action={<button onClick={openCreate}>New Item</button>}
 *   />
 */

import type { ReactNode } from "react"

interface ManagementPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function ManagementPageHeader({ title, subtitle, action }: ManagementPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="font-bengali text-lg font-bold text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
