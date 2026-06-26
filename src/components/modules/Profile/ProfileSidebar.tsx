"use client"

import { User2, ShoppingBag, CalendarDays } from "lucide-react"

import { authClient } from "@/lib/auth-client"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import ProfileAvatar from "./ProfileAvatar"
import RoleBadge from "./RoleBadge"
import { ProfileTab } from "./ProfileShell"

type Session = (typeof authClient.$Infer)["Session"]
type ProfileUser = Session["user"]

interface ProfileSidebarProps {
  user: ProfileUser
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

const navigation = [
  {
    id: "profile",
    label: "Profile",
    icon: User2,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    id: "reservations",
    label: "Reservations",
    icon: CalendarDays,
  },
] satisfies {
  id: ProfileTab
  label: string
  icon: React.ElementType
}[]

export default function ProfileSidebar({ user, activeTab, onTabChange }: ProfileSidebarProps) {
  return (
    <Card className="h-fit overflow-hidden rounded-3xl border-border shadow-sm">
      <CardContent className="space-y-8 p-6">
        {/* Avatar */}

        <div className="flex flex-col items-center text-center">
          <ProfileAvatar image={user.image} name={user.name} />

          <h2 className="mt-4 text-xl font-bold tracking-tight">{user.name}</h2>

          <p className="mt-1 text-sm text-muted-foreground break-all">{user.email}</p>

          {user.phone && <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>}

          <div className="mt-4">
            <RoleBadge role={user.role} />
          </div>
        </div>

        {/* Navigation */}

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon

            const active = activeTab === item.id

            return (
              <Button
                key={item.id}
                type="button"
                variant={active ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className="h-11 w-full justify-start rounded-xl"
              >
                <Icon className="mr-2 size-4" />

                {item.label}
              </Button>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
