"use client"

import { useEffect, useState } from "react"
import DashboardOverviewContent from "@/components/modules/Dashboard/DashboardOverviewContent"

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reports/stats")
      .then((r) => r.json())
      .then((json) => setData(json.data))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-bengali text-3xl font-bold text-foreground">ড্যাশবোর্ড (Dashboard)</h1>
          <p className="font-bengali mt-2 text-muted-foreground">
            আপনার রেস্তোরাঁর রিয়েল-টাইম পারফরম্যান্স এবং বিক্রয় ট্র্যাকিং দেখুন
          </p>
        </div>
        <div className="p-6 text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-bengali text-3xl font-bold text-foreground">ড্যাশবোর্ড (Dashboard)</h1>
        <p className="font-bengali mt-2 text-muted-foreground">
          আপনার রেস্তোরাঁর রিয়েল-টাইম পারফরম্যান্স এবং বিক্রয় ট্র্যাকিং দেখুন
        </p>
      </div>

      {/* Dashboard Content */}
      <DashboardOverviewContent data={data} />
    </div>
  )
}
