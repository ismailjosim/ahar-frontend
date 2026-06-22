/**
 * StatCard.tsx
 *
 * Reusable metric card for dashboard overview stats.
 * Accepts a DashboardStatCard config object and renders with the appropriate
 * tone (primary | accent | success | warning).
 *
 * Usage:
 *   import { dashboardStats } from "@/lib/dashboard.constant"
 *   {dashboardStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
 */

import type { DashboardStatCard } from "@/types/dashboard.interface"

const TONE_MAP: Record<DashboardStatCard["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
}

interface StatCardProps {
  stat: DashboardStatCard
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon
  const iconClass = TONE_MAP[stat.tone]

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bengali text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
        <p className="mt-1 font-bengali text-2xl font-bold text-foreground">{stat.value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{stat.helper}</p>
      </div>
    </div>
  )
}
