"use client"

/**
 * NavMain.tsx
 *
 * Renders the primary dashboard navigation links from adminNavItems config.
 * Mirrors WellSpace's nav-main.tsx decomposition pattern.
 */

import Link from "next/link"
import { usePathname } from "next/navigation"

import { adminNavItems, adminControlItems } from "@/lib/navitems.config"

interface NavMainProps {
  onNavClick?: () => void
}

export default function NavMain({ onNavClick }: NavMainProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Primary nav items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center justify-between gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "border-l-4 border-secondary bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className="size-5 shrink-0" />
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

      {/* Control / settings section */}
      <div className="border-t border-border px-4 py-4">
        <p className="font-bengali px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          অ্যাডমিন কন্ট্রোল
        </p>
      </div>

      <nav className="space-y-1.5 px-4 pb-6">
        {adminControlItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "border-l-4 border-secondary bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              <span className="font-bengali font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
