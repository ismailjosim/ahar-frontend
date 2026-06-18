"use client"

import { Bell, TrendingUp } from "lucide-react"
import type { DashboardStatCard, AdminOrderRow, AdminReservationRow, LowStockItem } from "@/types/dashboard.interface"

interface DashboardOverviewContentProps {
  stats: DashboardStatCard[]
  recentOrders: AdminOrderRow[]
  reservations: AdminReservationRow[]
  lowStockItems: LowStockItem[]
}

function StatCard({ stat }: { stat: DashboardStatCard }) {
  const toneStyles = {
    primary: "bg-secondary/30 text-primary",
    accent: "bg-primary-soft text-primary",
    success: "bg-success text-success-foreground",
    warning: "bg-warning-soft text-warning-foreground",
  }

  const Icon = stat.icon

  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${toneStyles[stat.tone]}`}>
          <Icon className="size-6" />
        </div>

        {stat.tone === "accent" && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
            লাইভ
          </span>
        )}

        {stat.tone === "warning" && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bengali text-xs font-bold text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            আজকে
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-bengali text-xs font-medium text-muted-foreground">{stat.label}</p>
        <h3 className="mt-1 text-2xl font-bold text-foreground">{stat.value}</h3>
        <p className="mt-1 font-bengali text-[10px] text-muted-foreground">{stat.helper}</p>
      </div>
    </div>
  )
}

export default function DashboardOverviewContent({
  stats,
  recentOrders,
  reservations,
  lowStockItems,
}: DashboardOverviewContentProps) {
  return (
    <div className="space-y-6 text-foreground">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bengali text-lg font-bold">বিক্রয় ও রাজস্ব বিশ্লেষণ</h3>
              <p className="font-bengali text-xs text-muted-foreground">সাপ্তাহিক রিয়েল-টাইম আয়ের গ্রাফ চিত্র</p>
            </div>

            <div className="flex items-center gap-1 self-start rounded-lg border border-border bg-muted p-1 sm:self-auto">
              <button className="rounded-md bg-card px-3 py-1 font-bengali text-xs font-medium text-primary shadow-sm">
                সপ্তাহ
              </button>
              <button className="rounded-md px-3 py-1 font-bengali text-xs font-medium text-muted-foreground transition hover:text-primary">
                মাসিক
              </button>
            </div>
          </div>

          <div className="flex h-80 items-center justify-center rounded-lg bg-linear-to-br from-muted to-card text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="mx-auto size-12 opacity-40" />
              <p className="mt-2 font-bengali text-sm">চার্ট প্লেসহোল্ডার</p>
              <p className="font-bengali text-xs opacity-70">Chart.js ইন্টিগ্রেশন হবে</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
          <div className="mb-6">
            <h3 className="font-bengali text-lg font-bold">সবচেয়ে জনপ্রিয় খাবার</h3>
            <p className="font-bengali text-xs text-muted-foreground">চলতি সপ্তাহের সর্বোচ্চ অর্ডার করা আইটেম</p>
          </div>

          <div className="flex h-64 items-center justify-center rounded-lg bg-linear-to-br from-muted to-card text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="mx-auto size-12 opacity-40" />
              <p className="mt-2 font-bengali text-sm">পাই চার্ট</p>
              <p className="font-bengali text-xs opacity-70">সবচেয়ে জনপ্রিয় আইটেম</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span>কাচ্চি বিরিয়ানি (35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-secondary" />
              <span>সর্ষে ইলিশ (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-foreground" />
              <span>চুইঝাল খাসি (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              <span>ভাপা পিঠা (20%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-3 animate-pulse rounded-full bg-primary" />
            <div>
              <h3 className="font-bengali text-lg font-bold">লাইভ অর্ডার ট্র্যাকার</h3>
              <p className="font-bengali text-xs text-muted-foreground">গ্রাহকের রিয়েল-টাইম অর্ডার স্থিতি</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg bg-primary px-3 py-1.5 font-bengali text-xs font-semibold text-primary-foreground">
              সব
            </button>
            {["অপেক্ষারত", "প্রস্তুত হচ্ছে", "সম্পন্ন"].map((label) => (
              <button
                key={label}
                className="rounded-lg bg-muted px-3 py-1.5 font-bengali text-xs font-semibold text-muted-foreground transition hover:bg-primary-soft hover:text-primary"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/60 font-bengali text-xs font-semibold uppercase text-muted-foreground">
                <th className="px-6 py-4 text-center">অর্ডার আইডি</th>
                <th className="px-6 py-4">গ্রাহক ও ফোন</th>
                <th className="px-6 py-4">আইটেম সমুহ</th>
                <th className="px-6 py-4">পরিশোধ</th>
                <th className="px-6 py-4 text-right">মোট</th>
                <th className="px-6 py-4 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-sm">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-muted/40">
                  <td className="px-6 py-4 text-center font-semibold">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bengali font-semibold">{order.customer}</div>
                    <div className="font-bengali text-xs text-muted-foreground">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{order.items}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">{order.method}</td>
                  <td className="px-6 py-4 text-right font-semibold">৳{order.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                          : order.status === "Preparing"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                            : order.status === "Ready"
                              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status === "Pending"
                        ? "অপেক্ষারত"
                        : order.status === "Preparing"
                          ? "প্রস্তুত হচ্ছে"
                          : order.status === "Ready"
                            ? "প্রস্তুত"
                            : "সম্পন্ন"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-6">
            <h3 className="font-bengali text-lg font-bold">আসন্ন রিজার্ভেশন</h3>
            <p className="font-bengali text-xs text-muted-foreground">টেবিল বুকিং ম্যানেজমেন্ট</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60 font-bengali text-xs font-semibold uppercase text-muted-foreground">
                  <th className="px-6 py-4">আইডি</th>
                  <th className="px-6 py-4">গ্রাহক</th>
                  <th className="px-6 py-4">সময়</th>
                  <th className="px-6 py-4">টেবিল</th>
                  <th className="px-6 py-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((res) => (
                  <tr key={res.id} className="transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-semibold">{res.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bengali font-semibold">{res.customer}</div>
                      <div className="text-xs text-muted-foreground">{res.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-bengali text-xs text-muted-foreground">{res.time}</td>
                    <td className="px-6 py-4 font-bengali text-xs font-semibold text-muted-foreground">{res.table}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          res.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                            : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        }`}
                      >
                        {res.status === "Pending" ? "অপেক্ষারত" : "অনুমোদিত"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <div>
                <h3 className="font-bengali text-lg font-bold">নিম্ন স্টক সতর্কতা</h3>
                <p className="font-bengali text-xs text-muted-foreground">রিফিল প্রয়োজনীয় আইটেম</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-6">
            {lowStockItems.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-lg border-l-4 p-4 ${
                  item.severity === "critical"
                    ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950"
                    : "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-950"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bengali font-semibold">{item.item}</p>
                    <p className="font-bengali text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span
                    className={`inline-block rounded px-2 py-1 font-bengali text-xs font-bold ${
                      item.severity === "critical"
                        ? "bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200"
                        : "bg-amber-200 text-amber-700 dark:bg-amber-700 dark:text-amber-200"
                    }`}
                  >
                    {item.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
