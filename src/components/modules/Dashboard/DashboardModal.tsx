"use client"

import type { ReactNode } from "react"

interface DashboardModalProps {
  children: ReactNode
  onClose: () => void
  title: string
  widthClass?: string
}

export default function DashboardModal({ children, onClose, title, widthClass = "max-w-3xl" }: DashboardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`max-h-[90vh] w-full ${widthClass} overflow-y-auto rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl`}
      >
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
          <h4 className="font-bengali text-lg font-bold">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold transition hover:bg-muted"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
