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
  const currentDate = format(new Date(), "dd MMM yyyy, EEEE")

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#F3E5D8] bg-white/95 px-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-[#F3E5D8] bg-white p-2 text-gray-700 shadow-sm transition hover:text-[#B22222] md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Date/Time Display */}
        <div className="hidden sm:block">
          <p className="font-bengali text-xs font-medium uppercase tracking-wide text-gray-500">
            স্বাগতম আহার ড্যাশবোর্ডে
          </p>
          <h2 className="font-bengali text-base font-bold text-gray-800 dark:text-white">
            {format(new Date(), "dd MMMM yyyy • EEEE")} {/* Bengali format when date-fns supports bengali */}
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Bar - Desktop Only */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="খাবার বা অর্ডার খুঁজুন..."
            className="rounded-xl border border-[#E9DAC1] bg-[#FFF8F0] py-2 pl-10 pr-4 text-sm focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222] dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-xl border border-[#F3E5D8] bg-white p-2.5 text-gray-600 transition hover:text-[#B22222] dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#B22222] text-xs font-bold text-white dark:border-slate-900">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[#F3E5D8] bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between bg-[#B22222] p-4 text-white">
                <span className="font-bengali font-semibold">বিজ্ঞপ্তি সমূহ</span>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-bengali underline hover:text-[#D4A017]"
                >
                  বন্ধ
                </button>
              </div>
              <div className="max-h-72 divide-y divide-[#F3E5D8] overflow-y-auto dark:divide-slate-700">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3.5 transition-colors hover:bg-[#FFF8F0]/60 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
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
                        <div className="flex-1">
                          <p className="font-bengali text-xs font-semibold text-gray-800 dark:text-white">
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-400">{notif.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">কোনো নতুন বিজ্ঞপ্তি নেই</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 border-l border-[#F3E5D8] pl-4 dark:border-slate-700">
          <div className="h-9 w-9 rounded-full border-2 border-[#D4A017] bg-gradient-to-br from-[#B22222] to-[#8B1414] flex items-center justify-center font-bold text-white">
            শ
          </div>
          <div className="hidden md:block text-left">
            <span className="font-bengali block text-xs font-bold text-gray-800 dark:text-white">শুভ্রাংশু এস.</span>
            <span className="text-[10px] font-semibold tracking-wide text-[#D4A017]">ম্যানেজার</span>
          </div>
        </div>
      </div>
    </header>
  )
}
