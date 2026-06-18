"use client"

import InventoryManagerContent from "@/components/modules/Dashboard/InventoryManagerContent"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-foreground">ইনভেন্টরি (Inventory)</h1>
        <p className="font-bengali mt-2 text-muted-foreground">স্টক পরিচালনা করুন এবং লো-স্টক সতর্কতা দেখুন</p>
      </div>

      <InventoryManagerContent />
    </div>
  )
}
