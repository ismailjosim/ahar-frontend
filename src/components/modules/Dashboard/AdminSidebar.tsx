"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, CookingPot, Utensils, Table2, CreditCard, PackageSearch, BarChart3, Settings, X } from "lucide-react"

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
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-canvas text-foreground shadow-xl backdrop-blur-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-border bg-card px-6">
          <Link
            href="/"
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Go to home"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition group-hover:bg-primary-hover">
              <span className="font-bengali text-2xl font-bold text-secondary">আ</span>
            </div>

            <h1 className="font-bengali text-2xl font-bold tracking-tight text-primary transition group-hover:text-primary-hover">
              আহার
              <span className="-mt-1 block text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Premium
              </span>
            </h1>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "border-l-4 border-secondary bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className="size-5" />
                  <span className="font-bengali font-medium">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <p className="font-bengali px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            অ্যাডমিন কন্ট্রোল
          </p>
        </div>

        <nav className="space-y-1.5 px-4 pb-6">
          {controlItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "border-l-4 border-secondary bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
                }`}
              >
                <Icon className="size-5" />
                <span className="font-bengali font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-secondary/30 bg-linear-to-br from-primary to-primary-hover font-bengali font-bold text-primary-foreground">
              শ
            </div>

            <div className="min-w-0 overflow-hidden">
              <h4 className="truncate font-bengali text-sm font-semibold text-foreground">শুভ্রাংশু শেখর</h4>
              <p className="truncate text-xs font-semibold text-secondary">Executive Chef / Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
