"use client"

import { useState } from "react"
import AdminSidebar from "@/components/modules/Dashboard/AdminSidebar"
import DashboardNotificationToasts from "@/components/modules/Dashboard/DashboardNotificationToasts"
import AdminTopbar from "@/components/modules/Dashboard/AdminTopbar"
import { dashboardNotifications } from "@/lib/dashboard.constant"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Fixed Sidebar - doesn't scroll */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area with left padding for desktop sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden md:pl-72">
        <DashboardNotificationToasts />
        <AdminTopbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} notifications={dashboardNotifications} />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
