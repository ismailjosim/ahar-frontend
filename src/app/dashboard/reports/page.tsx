"use client"

import ReportsManagerContent from "@/components/modules/Dashboard/ReportsManagerContent"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-foreground">রিপোর্টস (Reports)</h1>
        <p className="font-bengali mt-2 text-muted-foreground">
          Generate CSV reports for orders, payments, and inventory
        </p>
      </div>

      <ReportsManagerContent />
    </div>
  )
}
