"use client"

import ReservationsManagerContent from "@/components/modules/Dashboard/ReservationsManagerContent"

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-foreground">রিজার্ভেশন ম্যানেজার (Reservations)</h1>
        <p className="font-bengali mt-2 text-muted-foreground">টেবিল রিজার্ভেশন দেখুন, অনুমোদন করুন বা বাতিল করুন</p>
      </div>

      <ReservationsManagerContent />
    </div>
  )
}
