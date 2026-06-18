"use client"

import MenuManagerContent from "@/components/modules/Dashboard/MenuManagerContent"

export default function MenuManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-900 dark:text-white">মেনু ম্যানেজার (Menu)</h1>
        <p className="font-bengali mt-2 text-gray-600 dark:text-gray-400">মেনু আইটেম যোগ, সম্পাদনা ও অপসারণ করুন</p>
      </div>

      <MenuManagerContent />
    </div>
  )
}
