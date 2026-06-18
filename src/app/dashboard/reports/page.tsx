"use client"

import ReportsManagerContent from "@/components/modules/Dashboard/ReportsManagerContent"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-900 dark:text-white">রিপোর্টস (Reports)</h1>
        <p className="font-bengali mt-2 text-gray-600 dark:text-gray-400">
          Generate CSV reports for orders, payments, and inventory
        </p>
      </div>

      <ReportsManagerContent />
    </div>
  )
}
