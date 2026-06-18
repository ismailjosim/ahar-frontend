"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Gauge,
  CookingPot,
  Utensils,
  Table2,
  CreditCard,
  PackageSearch,
  BarChart3,
  Settings,
  X,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "ড্যাশবোর্ড (Dashboard)", icon: Gauge, badge: null },
  { href: "/dashboard/orders", label: "অর্ডার সমূহ (Orders)", icon: CookingPot, badge: "৪" },
  { href: "/dashboard/reservations", label: "রিজার্ভেশন (Reservations)", icon: Table2, badge: "৩" },
  { href: "/dashboard/menu", label: "মেনু ম্যানেজার (Menu)", icon: Utensils, badge: null },
  { href: "/dashboard/payments", label: "পেমেন্ট (Payments)", icon: CreditCard, badge: null },
  { href: "/dashboard/inventory", label: "ইনভেন্টরি (Inventory)", icon: PackageSearch, badge: null },
  { href: "/dashboard/reports", label: "রিপোর্টস (Reports)", icon: BarChart3, badge: null },
]

const controlItems = [{ href: "/dashboard/settings", label: "সেটিংস (Settings)", icon: Settings }]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar - Always Fixed, slides on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transform bg-white/95 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-slate-950 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#F3E5D8] bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B22222] shadow-md">
              <span className="font-bengali text-2xl font-bold text-[#D4A017]">আ</span>
            </div>
            <div>
              <h1 className="font-bengali text-2xl font-bold tracking-tight text-[#B22222]">
                আহার{" "}
                <span className="block -mt-1 text-xs font-bold uppercase tracking-widest text-[#D4A017]">Premium</span>
              </h1>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-700 transition hover:text-[#B22222] md:hidden dark:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3.5 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "border-l-4 border-[#D4A017] bg-red-50/50 text-[#B22222] dark:border-[#D4A017] dark:bg-red-950/20"
                    : "text-gray-600 hover:bg-red-50/50 hover:text-[#B22222] dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-[#D4A017]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className="h-5 w-5" />
                  <span className="font-bengali font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="animate-pulse rounded-full bg-[#B22222] px-2 py-0.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-[#F3E5D8] px-4 py-6 dark:border-slate-800">
          <p className="font-bengali px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            অ্যাডমিন কন্ট্রোল
          </p>
        </div>

        {/* Control Items */}
        <nav className="space-y-1.5 px-4 pb-6">
          {controlItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "border-l-4 border-[#D4A017] bg-red-50/50 text-[#B22222] dark:border-[#D4A017] dark:bg-red-950/20"
                    : "text-gray-600 hover:bg-red-50/50 hover:text-[#B22222] dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-[#D4A017]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-bengali font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Admin Profile Footer */}
        <div className="border-t border-[#F3E5D8] bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 rounded-xl border border-[#F3E5D8] bg-[#FFF1E2]/40 p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-[#D4A017]/30 bg-gradient-to-br from-[#B22222] to-[#8B1414] object-cover">
              <div className="flex h-full w-full items-center justify-center font-bengali font-bold text-white">শ</div>
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bengali text-sm font-semibold truncate text-gray-900 dark:text-white">
                শুভ্রাংশু শেখর
              </h4>
              <p className="text-xs font-semibold text-[#D4A017]">Executive Chef / Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
