/**
 * navitems.config.ts
 *
 * Single source of truth for all dashboard navigation items, mirroring the
 * WellSpace pattern.  Future multi-role support just needs a `roles` array
 * added to AdminNavItem and a `getNavItemsByRole()` helper — everything else
 * already reads from this file.
 */

import {
  BarChart3,
  CookingPot,
  CreditCard,
  Gauge,
  LayoutGrid,
  PackageSearch,
  Settings,
  Table2,
  Utensils,
} from "lucide-react"

import type { AdminNavItem } from "@/types/dashboard.interface"

/** Primary nav items rendered inside <NavMain />. */
export const adminNavItems: AdminNavItem[] = [
  {
    href: "/dashboard",
    label: "ড্যাশবোর্ড (Dashboard)",
    icon: Gauge,
  },
  {
    href: "/dashboard/orders",
    label: "অর্ডার সমূহ (Orders)",
    badge: "৪",
    icon: CookingPot,
  },
  {
    href: "/dashboard/menu",
    label: "মেনু ম্যানেজার (Menu)",
    icon: Utensils,
  },
  {
    href: "/dashboard/category",
    label: "ক্যাটাগরি (Category)",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/reservations",
    label: "রিজার্ভেশন (Reservations)",
    badge: "৩",
    icon: Table2,
  },
  {
    href: "/dashboard/payments",
    label: "পেমেন্ট (Payments)",
    icon: CreditCard,
  },
  {
    href: "/dashboard/inventory",
    label: "ইনভেন্টরি (Inventory)",
    icon: PackageSearch,
  },
  {
    href: "/dashboard/reports",
    label: "রিপোর্টস (Reports)",
    icon: BarChart3,
  },
]

/** Control / settings items rendered below the main nav. */
export const adminControlItems: AdminNavItem[] = [
  {
    href: "/dashboard/settings",
    label: "সেটিংস (Settings)",
    icon: Settings,
  },
]
