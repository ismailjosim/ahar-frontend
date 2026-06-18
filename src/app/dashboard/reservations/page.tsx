"use client"

import ReservationsManagerContent from "@/components/modules/Dashboard/ReservationsManagerContent"

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-900 dark:text-white">
          রিজার্ভেশন ম্যানেজার (Reservations)
        </h1>
        <p className="font-bengali mt-2 text-gray-600 dark:text-gray-400">
          টেবিল রিজার্ভেশন দেখুন, অনুমোদন করুন বা বাতিল করুন
        </p>
      </div>

      <ReservationsManagerContent />
    </div>
  )
}
