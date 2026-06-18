"use client"

import PaymentsManagerContent from "@/components/modules/Dashboard/PaymentsManagerContent"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-900 dark:text-white">
          পেমেন্ট ম্যানেজমেন্ট (Payments)
        </h1>
        <p className="font-bengali mt-2 text-gray-600 dark:text-gray-400">
          পেমেন্ট ট্রান্সঅ্যাকশন দেখুন, রিফান্ড এবং রিকনসাইল করুন
        </p>
      </div>

      <PaymentsManagerContent />
    </div>
  )
}
