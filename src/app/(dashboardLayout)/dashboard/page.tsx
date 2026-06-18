"use client"

import DashboardOverviewContent from "@/components/modules/Dashboard/DashboardOverviewContent"
import { dashboardStats, recentAdminOrders, recentAdminReservations, lowStockItems } from "@/lib/dashboard.constant"

export default function DashboardPage() {
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
      <DashboardOverviewContent
        stats={dashboardStats}
        recentOrders={recentAdminOrders}
        reservations={recentAdminReservations}
        lowStockItems={lowStockItems}
      />
    </div>
  )
}
