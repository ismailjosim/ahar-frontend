"use client"

import { useEffect, useState } from "react"
import type { ReportSummary } from "@/types/dashboard.interface"

export default function ReportsManagerContent() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState("")

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().split("T")[0]
  })
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])

  // Fetch summary stats when dates change
  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ from: fromDate, to: toDate })
        const res = await fetch(`/api/reports/summary?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch summary")
        const json = await res.json()
        setSummary(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setSummary(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSummary()
  }, [fromDate, toDate])

  // Format currency in BDT
  const formatCurrency = (amount: number): string => {
    return `৳${amount.toLocaleString("bn-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  // Report stats to display
  const reportStats = summary
    ? [
        {
          label: "Gross Sales",
          value: formatCurrency(summary.revenue),
          helper: `From ${new Date(summary.fromDate).toLocaleDateString("bn-BD")} to ${new Date(summary.toDate).toLocaleDateString("bn-BD")}`,
        },
        {
          label: "Orders",
          value: summary.totalOrders.toString(),
          helper: `Average value: ${formatCurrency(summary.avgOrderValue)}`,
        },
        {
          label: "Avg. Ticket",
          value: formatCurrency(summary.avgOrderValue),
          helper: `Total: ${summary.totalOrders} orders`,
        },
        {
          label: "Best Seller",
          value: summary.topItems[0]?.name || "N/A",
          helper: `${summary.topItems[0]?.quantity || 0} sold`,
        },
      ]
    : [
        { label: "Gross Sales", value: "—", helper: "Loading..." },
        { label: "Orders", value: "—", helper: "Loading..." },
        { label: "Avg. Ticket", value: "—", helper: "Loading..." },
        { label: "Best Seller", value: "—", helper: "Loading..." },
      ]

  async function download(type: string) {
    setDownloading(type)
    try {
      const params = new URLSearchParams({ type, from: fromDate, to: toDate })
      const res = await fetch(`/api/reports/export?${params.toString()}`)
      if (!res.ok) return alert("Failed to generate report")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ahar-${type}-${fromDate}-to-${toDate}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Error downloading report: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setDownloading("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-bengali text-lg font-bold">Analytics Snapshot</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Review sales, orders, best sellers, and export reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="space-y-1 text-xs font-bold text-muted-foreground">
              From
              <input
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                type="date"
                className="block rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-bold text-muted-foreground">
              To
              <input
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                type="date"
                className="block rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            Error: {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reportStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-muted/30 p-4 opacity-100 transition"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="mt-2 truncate text-2xl font-black text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="font-bengali text-lg font-bold">Best Sellers</h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <p className="py-4 text-sm text-muted-foreground">Loading...</p>
            ) : summary && summary.topItems.length > 0 ? (
              summary.topItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                  </div>
                  <p className="font-black text-primary">{formatCurrency(item.revenue)}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-muted-foreground">No data available for this period</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="font-bengali text-lg font-bold">Export Reports</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Downloads include the selected date range in the filename.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["orders", "reservations", "inventory"].map((type) => (
              <button
                key={type}
                onClick={() => download(type)}
                disabled={!!downloading}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-bold capitalize transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50 first:bg-primary first:text-primary-foreground"
              >
                {downloading === type ? "Exporting..." : `Export ${type}`}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-warning-soft p-4 text-xs leading-5 text-warning-foreground">
            Scheduled exports should be handled by a future backend cron or task runner so reports can be emailed
            automatically.
          </div>
        </div>
      </div>
    </div>
  )
}
