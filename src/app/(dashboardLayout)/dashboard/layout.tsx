"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import AdminSidebar from "@/components/modules/Dashboard/AdminSidebar"
import AdminTopbar from "@/components/modules/Dashboard/AdminTopbar"
import DashboardNotificationToasts from "@/components/modules/Dashboard/DashboardNotificationToasts"
import { authClient } from "@/lib/auth-client"
import { dashboardNotifications } from "@/lib/dashboard.constant"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Secondary client-side guard — proxy.ts is the primary protection at the edge.
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login?callbackURL=/dashboard")
    }
  }, [session, isPending, router])

  // Show a blank shell while session is resolving to avoid flash of content.
  if (isPending) {
    return <div className="min-h-screen bg-background" />
  }

  // Proxy.ts should have already redirected, but guard here as a safety net.
  if (!session) {
    return null
  }

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
