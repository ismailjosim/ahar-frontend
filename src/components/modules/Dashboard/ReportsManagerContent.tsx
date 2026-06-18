"use client"

import { useState } from "react"

const reportStats = [
  { label: "Gross Sales", value: "৳45,780", helper: "+12% from selected period" },
  { label: "Orders", value: "128", helper: "Delivery leads at 58%" },
  { label: "Avg. Ticket", value: "৳358", helper: "Best during dinner" },
  { label: "Low Stock", value: "3", helper: "Needs purchase review" },
]

const bestSellers = [
  { name: "Royal Mutton Kacchi", orders: 38, revenue: "৳15,960" },
  { name: "Shorshe Ilish", orders: 24, revenue: "৳12,480" },
  { name: "Chicken Roast Combo", orders: 21, revenue: "৳7,560" },
]

export default function ReportsManagerContent() {
  const [fromDate, setFromDate] = useState("2026-06-01")
  const [toDate, setToDate] = useState("2026-06-18")
  const [downloading, setDownloading] = useState("")

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
      a.download = `${type}_${fromDate}_to_${toDate}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reportStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-black text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="font-bengali text-lg font-bold">Best Sellers</h3>
          <div className="mt-4 space-y-3">
            {bestSellers.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4"
              >
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                </div>
                <p className="font-black text-primary">{item.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="font-bengali text-lg font-bold">Export Reports</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Downloads include the selected date range in the filename.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["orders", "payments", "inventory"].map((type) => (
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
