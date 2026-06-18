"use client"

import { WalletCards, ShoppingBag, CalendarCheck, ClipboardList, Bell, TrendingUp, Filter } from "lucide-react"
import type { DashboardStatCard, AdminOrderRow, AdminReservationRow, LowStockItem } from "@/types/dashboard.interface"

interface DashboardOverviewContentProps {
  stats: DashboardStatCard[]
  recentOrders: AdminOrderRow[]
  reservations: AdminReservationRow[]
  lowStockItems: LowStockItem[]
}

function StatCard({ stat }: { stat: DashboardStatCard }) {
  const toneStyles = {
    primary: "bg-orange-50 text-[#B22222] dark:bg-orange-950 dark:text-orange-400",
    accent: "bg-red-50 text-[#B22222] dark:bg-red-950 dark:text-red-400",
    success: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  }

  const Icon = stat.icon

  return (
    <div className="rounded-2xl border border-[#F3E5D8] bg-white p-5 transition-all duration-300 hover:border-[#B22222]/40 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${toneStyles[stat.tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {stat.tone === "accent" && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
            লাইভ
          </span>
        )}
        {stat.tone === "warning" && (
          <span className="rounded-full bg-amber-50/50 px-2 py-0.5 font-bengali text-xs font-bold text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            আজকে
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="font-bengali text-xs font-medium text-gray-400">{stat.label}</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
        <p className="font-bengali mt-1 text-[10px] text-gray-400">{stat.helper}</p>
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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-[#F3E5D8] bg-white p-6 dark:border-slate-700 dark:bg-slate-800 lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">
                বিক্রয় ও রাজস্ব বিশ্লেষণ
              </h3>
              <p className="font-bengali text-xs text-gray-400">সাপ্তাহিক রিয়েল-টাইম আয়ের গ্রাফ চিত্র</p>
            </div>
            <div className="flex items-center gap-1 self-start rounded-lg border border-[#F3E5D8] bg-[#FFF8F0] p-1 sm:self-auto dark:border-slate-700 dark:bg-slate-700">
              <button className="rounded-md bg-white px-3 py-1 font-bengali text-xs font-medium text-[#B22222] shadow-sm dark:bg-slate-800 dark:text-[#D4A017]">
                সপ্তাহ
              </button>
              <button className="rounded-md px-3 py-1 font-bengali text-xs font-medium text-gray-600 hover:text-[#B22222] dark:text-gray-400 dark:hover:text-[#D4A017]">
                মাসিক
              </button>
            </div>
          </div>
          <div className="flex h-80 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFF8F0] to-white text-gray-400 dark:from-slate-700 dark:to-slate-800">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-600" />
              <p className="mt-2 font-bengali text-sm">চার্ট প্লেসহোল্ডার</p>
              <p className="font-bengali text-xs text-gray-300">Chart.js ইন্টিগ্রেশন হবে</p>
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="rounded-2xl border border-[#F3E5D8] bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-6">
            <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">সবচেয়ে জনপ্রিয় খাবার</h3>
            <p className="font-bengali text-xs text-gray-400">চলতি সপ্তাহের সর্বোচ্চ অর্ডার করা আইটেম</p>
          </div>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFF8F0] to-white text-gray-400 dark:from-slate-700 dark:to-slate-800">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-600" />
              <p className="mt-2 font-bengali text-sm">পাই চার্ট</p>
              <p className="font-bengali text-xs text-gray-300">সবচেয়ে জনপ্রিয় আইটেম</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B22222]"></span>
              <span>কাচ্চি বিরিয়ানি (35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A017]"></span>
              <span>সর্ষে ইলিশ (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1F2937]"></span>
              <span>চুইঝাল খাসি (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#34D399]"></span>
              <span>ভাপা পিঠা (20%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3E5D8] bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 border-b border-[#F3E5D8] p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-red-400"></span>
            <div>
              <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">লাইভ অর্ডার ট্র্যাকার</h3>
              <p className="font-bengali text-xs text-gray-400">গ্রাহকের রিয়েল-টাইম অর্ডার স্থিতি</p>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg bg-[#B22222] px-3 py-1.5 font-bengali text-xs font-semibold text-white">
              সব
            </button>
            <button className="rounded-lg bg-[#FFF8F0] px-3 py-1.5 font-bengali text-xs font-semibold text-gray-600 hover:bg-red-50 dark:bg-slate-700 dark:text-gray-400">
              অপেক্ষারত
            </button>
            <button className="rounded-lg bg-[#FFF8F0] px-3 py-1.5 font-bengali text-xs font-semibold text-gray-600 hover:bg-red-50 dark:bg-slate-700 dark:text-gray-400">
              প্রস্তুত হচ্ছে
            </button>
            <button className="rounded-lg bg-[#FFF8F0] px-3 py-1.5 font-bengali text-xs font-semibold text-gray-600 hover:bg-red-50 dark:bg-slate-700 dark:text-gray-400">
              সম্পন্ন
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F3E5D8] bg-[#FFF8F0]/60 font-bengali text-xs font-semibold uppercase text-gray-500 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-400">
                <th className="px-6 py-4 text-center">অর্ডার আইডি</th>
                <th className="px-6 py-4">গ্রাহক ও ফোন</th>
                <th className="px-6 py-4">আইটেম সমুহ</th>
                <th className="px-6 py-4">পরিশোধ</th>
                <th className="px-6 py-4 text-right">মোট</th>
                <th className="px-6 py-4 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3E5D8] text-sm dark:divide-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#FFF8F0]/40 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 text-center font-semibold text-gray-800 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bengali font-semibold text-gray-800 dark:text-white">{order.customer}</div>
                    <div className="font-bengali text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">{order.items}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300">{order.method}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">৳{order.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                          : order.status === "Preparing"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                            : order.status === "Ready"
                              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-400"
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

      {/* Reservations & Low Stock Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reservations */}
        <div className="overflow-hidden rounded-2xl border border-[#F3E5D8] bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-[#F3E5D8] p-6 dark:border-slate-700">
            <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">আসন্ন রিজার্ভেশন</h3>
            <p className="font-bengali text-xs text-gray-400">টেবিল বুকিং ম্যানেজমেন্ট</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F3E5D8] bg-[#FFF8F0]/60 font-bengali text-xs font-semibold uppercase text-gray-500 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-400">
                  <th className="px-6 py-4">আইডি</th>
                  <th className="px-6 py-4">গ্রাহক</th>
                  <th className="px-6 py-4">সময়</th>
                  <th className="px-6 py-4">টেবিল</th>
                  <th className="px-6 py-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3E5D8] dark:divide-slate-700">
                {reservations.map((res) => (
                  <tr key={res.id} className="transition hover:bg-[#FFF8F0]/40 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{res.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bengali font-semibold text-gray-800 dark:text-white">{res.customer}</div>
                      <div className="text-xs text-gray-400">{res.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-bengali text-xs text-gray-600 dark:text-gray-300">{res.time}</td>
                    <td className="px-6 py-4 font-bengali text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {res.table}
                    </td>
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

        {/* Low Stock Items */}
        <div className="overflow-hidden rounded-2xl border border-[#F3E5D8] bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-[#F3E5D8] p-6 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#B22222] dark:text-[#D4A017]" />
              <div>
                <h3 className="font-bengali text-lg font-bold text-gray-800 dark:text-white">নিম্ন স্টক সতর্কতা</h3>
                <p className="font-bengali text-xs text-gray-400">রিফিল প্রয়োজনীয় আইটেম</p>
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
                    <p className="font-bengali font-semibold text-gray-800 dark:text-white">{item.item}</p>
                    <p className="font-bengali text-xs text-gray-600 dark:text-gray-400">{item.category}</p>
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
