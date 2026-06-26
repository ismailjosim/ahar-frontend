"use client"

import { useState } from "react"

import { authClient } from "@/lib/auth-client"

import { Card } from "@/components/ui/card"

import ProfileSidebar from "./ProfileSidebar"
import ProfileTabs, { ProfileTab } from "./ProfileTabs"

type Session = (typeof authClient.$Infer)["Session"]
type ProfileUser = Session["user"]

interface ProfileShellProps {
  user: ProfileUser
  refetch: () => Promise<void>
}

export default function ProfileShell({ user, refetch }: ProfileShellProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")

  return (
    <main className="page-shell min-h-screen bg-canvas px-4 py-8 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <ProfileSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />

        <Card className="overflow-hidden rounded-3xl border-border bg-card shadow-sm">
          <ProfileTabs activeTab={activeTab} user={user} refetch={refetch} />
        </Card>
      </div>
    </main>
  )
}
