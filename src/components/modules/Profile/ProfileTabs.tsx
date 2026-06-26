"use client"

import { authClient } from "@/lib/auth-client"

import ProfileEditor from "./ProfileEditor"
import OrdersTab from "./OrdersTab"
import ReservationsTab from "./ReservationsTab"

export type ProfileTab = "profile" | "orders" | "reservations"

type Session = (typeof authClient.$Infer)["Session"]
type ProfileUser = Session["user"]

interface ProfileTabsProps {
  activeTab: ProfileTab
  user: ProfileUser
  refetch: () => Promise<void>
}

export default function ProfileTabs({ activeTab, user, refetch }: ProfileTabsProps) {
  switch (activeTab) {
    case "orders":
      return <OrdersTab />

    case "reservations":
      return <ReservationsTab />

    case "profile":
    default:
      return <ProfileEditor user={user} refetch={refetch} />
  }
}
