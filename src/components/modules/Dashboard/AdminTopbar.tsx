"use client"

import { useState } from "react"
import { Menu, Bell, Search } from "lucide-react"
import { format } from "date-fns"

interface AdminTopbarProps {
  onMenuClick?: () => void
  notifications?: Array<{
    id: string
    type: "success" | "warning" | "info"
    title: string
    timestamp: string
  }>
}

export default function AdminTopbar({ onMenuClick, notifications = [] }: AdminTopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-card/95 px-6 text-card-foreground backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-primary md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:block">
          <p className="font-bengali text-xs font-medium uppercase tracking-wide text-muted-foreground">
            স্বাগতম আহার ড্যাশবোর্ডে
          </p>

          <h2 className="font-bengali text-base font-bold text-foreground">
            {format(new Date(), "dd MMMM yyyy • EEEE")}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="খাবার বা অর্ডার খুঁজুন..."
            className="w-72 rounded-xl border border-input bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((open) => !open)}
            className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground transition hover:bg-muted hover:text-primary"
            aria-label="Toggle notifications"
          >
            <Bell className="size-5" />

            {notifications.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-bold text-primary-foreground">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl">
              <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                <span className="font-bengali font-semibold">বিজ্ঞপ্তি সমূহ</span>

                <button
                  type="button"
                  onClick={() => setIsNotifOpen(false)}
                  className="font-bengali text-xs underline underline-offset-4 transition hover:text-secondary"
                >
                  বন্ধ
                </button>
              </div>

              <div className="max-h-72 divide-y divide-border overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-3.5 transition-colors hover:bg-muted/60">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 flex size-8 items-center justify-center rounded-lg font-bold ${
                            notif.type === "success"
                              ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                              : notif.type === "warning"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                          }`}
                        >
                          {notif.type === "success" && "✓"}
                          {notif.type === "warning" && "!"}
                          {notif.type === "info" && "ℹ"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bengali text-xs font-semibold text-foreground">{notif.title}</p>

                          <p className="mt-0.5 text-[10px] text-muted-foreground">{notif.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">কোনো নতুন বিজ্ঞপ্তি নেই</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
