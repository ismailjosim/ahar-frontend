"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import DashboardModal from "@/components/modules/Dashboard/DashboardModal"
import { notifyDashboard } from "@/components/modules/Dashboard/DashboardNotificationToasts"

interface StaffUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: string
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

const roleBadgeStyles: Record<string, string> = {
  super_admin: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800",
  owner: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
  manager: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  kitchen: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  cashier: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800",
}

const roleNames: Record<string, string> = {
  super_admin: "সুপার এডমিন (Super Admin)",
  owner: "মালিক (Owner)",
  manager: "ম্যানেজার (Manager)",
  kitchen: "কিচেন স্টাফ (Kitchen)",
  cashier: "ক্যাশিয়ার (Cashier)",
}

export default function StaffManagerContent() {
  const { data: session } = authClient.useSession()
  const [items, setItems] = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // Search query
  const [search, setSearch] = useState("")

  // Invite modal states
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("cashier")
  const [inviting, setInviting] = useState(false)

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch(`/api/staff?page=${page}&pageSize=${pageSize}`)
      const body = await res.json()
      setItems(body.data || [])
      setTotal(body.total || 0)
    } catch {
      notifyDashboard("স্টাফ তালিকা লোড করতে ব্যর্থ হয়েছে", "warning")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Filter items client-side if a search string is entered.
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.phone && item.phone.includes(search)),
  )

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      notifyDashboard("ইমেইল আবশ্যক", "warning")
      return
    }

    setInviting(true)
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const data = await res.json()

      if (res.ok) {
        notifyDashboard("আমন্ত্রণ ইমেইল সফলভাবে পাঠানো হয়েছে!", "success")
        setIsInviteOpen(false)
        setInviteEmail("")
        setInviteRole("cashier")
      } else {
        notifyDashboard(data.error || "আমন্ত্রণ পাঠাতে ব্যর্থ হয়েছে", "warning")
      }
    } catch {
      notifyDashboard("নেটওয়ার্ক ত্রুটি ঘটেছে", "warning")
    } finally {
      setInviting(false)
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    try {
      const res = await fetch(`/api/staff/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()

      if (res.ok) {
        notifyDashboard("স্টাফের পদ সফলভাবে পরিবর্তন করা হয়েছে", "success")
        fetchList()
      } else {
        notifyDashboard(data.error || "পদ পরিবর্তন করতে ব্যর্থ হয়েছে", "warning")
      }
    } catch {
      notifyDashboard("নেটওয়ার্ক ত্রুটি ঘটেছে", "warning")
    }
  }

  async function handleActiveToggle(id: string, currentActive: boolean) {
    const actionLabel = currentActive ? "নিষ্ক্রিয়" : "সক্রিয়"
    if (!confirm(`আপনি কি এই স্টাফ অ্যাকাউন্টটি ${actionLabel} করতে চান?`)) {
      return
    }

    try {
      const res = await fetch(`/api/staff/${id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      })
      const data = await res.json()

      if (res.ok) {
        notifyDashboard(`স্টাফ অ্যাকাউন্টটি সফলভাবে ${actionLabel} করা হয়েছে`, "success")
        fetchList()
      } else {
        notifyDashboard(data.error || "অবস্থা পরিবর্তন করতে ব্যর্থ হয়েছে", "warning")
      }
    } catch {
      notifyDashboard("নেটওয়ার্ক ত্রুটি ঘটেছে", "warning")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bengali text-2xl font-black text-foreground">স্টাফ ব্যবস্থাপনা (Staff Management)</h2>
          <p className="text-sm text-muted-foreground">স্টাফদের ভূমিকা এবং স্থিতি পরিবর্তন করুন অথবা নতুন স্টাফদের আমন্ত্রণ পাঠান।</p>
        </div>
        <div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="w-full sm:w-auto rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover shadow-sm"
          >
            নতুন স্টাফ আমন্ত্রণ (Invite Staff)
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            placeholder="নাম, ইমেল অথবা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">লোডিং হচ্ছে... (Loading...)</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-6 py-4 font-bengali text-xs font-black uppercase tracking-wider text-muted-foreground">নাম (Name)</th>
                <th className="px-6 py-4 font-bengali text-xs font-black uppercase tracking-wider text-muted-foreground">ইমেইল ও ফোন (Email & Phone)</th>
                <th className="px-6 py-4 font-bengali text-xs font-black uppercase tracking-wider text-muted-foreground">ভূমিকা (Role)</th>
                <th className="px-6 py-4 font-bengali text-xs font-black uppercase tracking-wider text-muted-foreground">অবস্থা (Status)</th>
                <th className="px-6 py-4 font-bengali text-xs font-black uppercase tracking-wider text-muted-foreground text-right">পদ পরিবর্তন (Change Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length > 0 ? (
                filteredItems.map((r) => {
                  const isSelf = r.id === session?.user?.id
                  return (
                    <tr key={r.id} className="hover:bg-muted/10 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                            {r.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold text-foreground">{r.name}</span>
                            {isSelf && (
                              <span className="inline-block rounded bg-primary/20 px-1 py-0.5 text-[10px] font-semibold text-primary">
                                আপনি নিজে (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-foreground">{r.email}</span>
                        {r.phone ? (
                          <span className="block text-xs text-muted-foreground">{r.phone}</span>
                        ) : (
                          <span className="block text-xs text-muted-foreground italic">ফোন নম্বর নেই</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            roleBadgeStyles[r.role] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {roleNames[r.role] || r.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={r.isActive}
                            disabled={isSelf}
                            onChange={() => handleActiveToggle(r.id, r.isActive)}
                            className="size-4 rounded accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className={`text-xs font-bold ${r.isActive ? "text-success" : "text-destructive"}`}>
                            {r.isActive ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Inactive)"}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={r.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(r.id, e.target.value)}
                          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="cashier">ক্যাশিয়ার (Cashier)</option>
                          <option value="kitchen">কিচেন (Kitchen)</option>
                          <option value="manager">ম্যানেজার (Manager)</option>
                          <option value="owner">মালিক (Owner)</option>
                          <option value="super_admin">সুপার এডমিন (Super Admin)</option>
                        </select>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    কোন স্টাফ পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-semibold text-muted-foreground">সর্বমোট স্টাফ: {total}</div>
        <div className="flex items-center gap-3">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            পূর্ববর্তী (Prev)
          </button>
          <div className="text-xs font-bold text-foreground">পৃষ্ঠা {page}</div>
          <button
            disabled={page * pageSize >= total || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            পরবর্তী (Next)
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <DashboardModal
          title="নতুন স্টাফ আমন্ত্রণ পাঠান (Invite Staff)"
          onClose={() => {
            setIsInviteOpen(false)
            setInviteEmail("")
            setInviteRole("cashier")
          }}
          widthClass="max-w-md"
        >
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ইমেইল ঠিকানা (Email Address)</label>
              <input
                type="email"
                placeholder="staff@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ভূমিকা নির্ধারণ (Select Role)</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className={inputClass}
              >
                <option value="cashier">ক্যাশিয়ার (Cashier)</option>
                <option value="kitchen">কিচেন স্টাফ (Kitchen)</option>
                <option value="manager">ম্যানেজার (Manager)</option>
                <option value="owner">মালিক (Owner)</option>
                <option value="super_admin">সুপার এডমিন (Super Admin)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold transition hover:bg-muted"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="submit"
                disabled={inviting}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
              >
                {inviting ? "পাঠানো হচ্ছে..." : "আমন্ত্রণ পাঠান (Send Invite)"}
              </button>
            </div>
          </form>
        </DashboardModal>
      )}
    </div>
  )
}
