"use client"

export default function ReportsManagerContent() {
  async function download(type: string) {
    const res = await fetch(`/api/reports/export?type=${type}`)
    if (!res.ok) return alert("Failed to generate report")
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}_report.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-bengali text-lg font-bold">Export Reports</h3>
        <p className="text-sm text-gray-500 mt-2">Click to download CSV reports</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => download("orders")} className="rounded-md bg-[var(--primary)] px-4 py-2 text-white">
            Export Orders
          </button>
          <button onClick={() => download("payments")} className="rounded-md border px-4 py-2">
            Export Payments
          </button>
          <button onClick={() => download("inventory")} className="rounded-md border px-4 py-2">
            Export Inventory
          </button>
        </div>
      </div>
    </div>
  )
}
