"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import StaffManagerContent from "@/components/modules/Dashboard/StaffManagerContent"

export default function StaffPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && session && session.user.role !== "super_admin") {
      router.replace("/dashboard")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-bengali text-sm text-muted-foreground">
        লোডিং হচ্ছে...
      </div>
    )
  }

  if (!session || session.user.role !== "super_admin") {
    return null
  }

  return (
    <div className="space-y-6">
      <StaffManagerContent />
    </div>
  )
}
