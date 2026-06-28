"use client"

/**
 * AdminSidebar.tsx
 *
 * Sidebar shell — composes <NavMain /> (primary nav) and <NavUser /> (profile /
 * logout).  Nav items are driven by navitems.config.ts; this file owns only
 * the structural layout and the mobile overlay.
 *
 * Mirrors WellSpace's app-sidebar.tsx composition pattern.
 */

import Link from "next/link"
import { X } from "lucide-react"

import NavMain from "@/components/modules/Dashboard/NavMain"
import NavUser from "@/components/modules/Dashboard/NavUser"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-canvas text-foreground shadow-xl backdrop-blur-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* ── Sidebar header ──────────────────────────────────────────────── */}
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

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Primary navigation ──────────────────────────────────────────── */}
        <NavMain onNavClick={onClose} />

        {/* ── User profile + logout ────────────────────────────────────────── */}
        <NavUser onNavClick={onClose} />
      </aside>
    </>
  )
}
