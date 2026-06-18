"use client"

import OrdersPageContent from "@/components/modules/Dashboard/OrdersPageContent"
import { recentAdminOrders } from "@/lib/dashboard.constant"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-900 dark:text-white">অর্ডার ম্যানেজমেন্ট (Orders)</h1>
        <p className="font-bengali mt-2 text-gray-600 dark:text-gray-400">
          সব অর্ডার দেখুন, স্ট্যাটাস আপডেট করুন ও বিস্তারিত দেখুন
        </p>
      </div>

      <OrdersPageContent orders={recentAdminOrders} />
    </div>
  )
}
