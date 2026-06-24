"use client"

import Link from "next/link"
import { FormEvent, useCallback, useEffect, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Save,
  ShoppingBag,
  UserRound,
  UtensilsCrossed,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { orderStatusLabels } from "@/lib/order.constant"
import { normalizeBDPhone, validateBDPhone } from "@/lib/phone.utils"
import type { AdminOrderRow } from "@/types/dashboard.interface"
import type { ReservationHistoryItem } from "@/types/profile.interface"

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileTab = "profile" | "orders" | "reservations"
type AuthSession = (typeof authClient.$Infer)["Session"]
type ProfileUser = AuthSession["user"]

// ─── Status badge colours ─────────────────────────────────────────────────────

const orderStatusColor: Record<string, string> = {
  Placed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Accepted: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  Preparing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Ready: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Out for Delivery": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
}

const reservationStatusColor: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  Cancelled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession()
  const user = session?.user

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <Button asChild>
          <Link href="/auth/login?callbackURL=/profile">Sign in to manage profile</Link>
        </Button>
      </main>
    )
  }

  return <ProfileShell key={`${user.id}-${user.updatedAt}`} user={user} refetch={refetch} />
}

// ─── Shell (aside + tabs) ─────────────────────────────────────────────────────

function ProfileShell({ user, refetch }: { user: ProfileUser; refetch: () => Promise<void> }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")

  const extUser = user as ProfileUser & { phone?: string | null }
  const avatarUrl = (user.image || "").trim()

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserRound className="size-4" /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag className="size-4" /> },
    { id: "reservations", label: "My Reservations", icon: <CalendarDays className="size-4" /> },
  ]

  return (
    <main className="bg-canvas min-h-screen px-4 py-10 text-foreground">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[300px_1fr]">
        {/* ── Aside ── */}
        <aside className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm lg:self-start">
          {/* Avatar */}
          <div
            className="mx-auto flex size-28 items-center justify-center rounded-full border-2 border-primary/30 bg-muted bg-cover bg-center text-primary shadow-inner"
            style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
            aria-label="Profile image preview"
          >
            {!avatarUrl && <UserRound className="size-12" aria-hidden="true" />}
          </div>

          {/* Identity */}
          <div className="mt-5 text-center">
            <h1 className="text-lg font-bold">{user.name || "Your profile"}</h1>
            <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>
            {extUser.phone && (
              <p className="mt-1 text-sm text-muted-foreground">{extUser.phone}</p>
            )}
          </div>

          {/* Tab nav */}
          <nav className="mt-6 flex flex-col gap-1" aria-label="Profile sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <Button asChild variant="outline" className="mt-6 h-9 w-full text-sm">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </aside>

        {/* ── Main panel ── */}
        <section className="rounded-xl border border-border bg-card shadow-sm">
          {activeTab === "profile" && (
            <ProfileEditor user={user} refetch={refetch} />
          )}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "reservations" && <ReservationsTab />}
        </section>
      </div>
    </main>
  )
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileEditor({ user, refetch }: { user: ProfileUser; refetch: () => Promise<void> }) {
  const extUser = user as ProfileUser & { phone?: string | null }
  const [name, setName] = useState(user.name || "")
  const [image, setImage] = useState(user.image || "")
  const [phone, setPhone] = useState(extUser.phone || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (phone.trim() && !validateBDPhone(phone.trim())) {
      setError("Please enter a valid Bangladeshi phone number (e.g. 01711000000).")
      return
    }

    if (image.trim() && !image.trim().startsWith("http")) {
      setError("Please enter a valid image URL starting with http.")
      return
    }

    setIsSaving(true)

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim() ? normalizeBDPhone(phone.trim()) : null,
      })

      if (updateError) {
        setError(updateError.message || "Unable to update your profile.")
        return
      }

      await refetch()
      setSuccess("Profile updated successfully.")
    } catch {
      setError("Something went wrong while updating your profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Profile settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your display name, phone, and profile image URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm font-medium">
          <span>Name</span>
          <span className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Your name"
              required
            />
          </span>
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>Phone</span>
          <span className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="+880 1XXX-XXXXXX"
            />
          </span>
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>Image URL</span>
          <span className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <ImageIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="profile-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              autoComplete="url"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="https://example.com/avatar.jpg"
            />
          </span>
        </label>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm text-success"
          >
            {success}
          </div>
        )}

        <Button id="profile-save-btn" type="submit" className="h-10" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" />
          )}
          Save changes
        </Button>
      </form>
    </div>
  )
}

// ─── My Orders tab ────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 5

  const fetchOrders = useCallback(
    async (p: number) => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/orders/my?page=${p}&pageSize=${pageSize}`)
        const json = await res.json()
        setOrders(json.data ?? [])
        setTotal(json.total ?? 0)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchOrders(page)
  }, [page, fetchOrders])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">My Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {total > 0 ? `${total} order${total !== 1 ? "s" : ""} placed` : "Your order history"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <ShoppingBag className="size-10 opacity-30" />
          <p className="text-sm">You haven&apos;t placed any orders yet.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/menu">Browse the menu</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Order history">
          {orders.map((order) => {
            const shortId = order.id.slice(0, 8).toUpperCase()
            const date = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"
            const statusClass =
              orderStatusColor[order.status] ??
              "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
            const statusLabel =
              orderStatusLabels[order.status as keyof typeof orderStatusLabels] ?? order.status

            return (
              <li
                key={order.id}
                className="rounded-xl border border-border bg-background/60 p-4 transition-colors hover:bg-background"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      #{shortId}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {date}
                  </div>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-foreground">
                  {order.items || order.itemSummary || "—"}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold text-primary">৳{order.total.toFixed(2)}</span>
                    {order.fulfillmentType && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {order.type || order.fulfillmentType}
                      </span>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={`/order-tracking?id=${order.id}`}>Track order</Link>
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {!isLoading && total > pageSize && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              id="orders-prev-btn"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              id="orders-next-btn"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── My Reservations tab ──────────────────────────────────────────────────────

function ReservationsTab() {
  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 5

  const fetchReservations = useCallback(
    async (p: number) => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/reservations/my?page=${p}&pageSize=${pageSize}`)
        const json = await res.json()
        setReservations(json.data ?? [])
        setTotal(json.total ?? 0)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchReservations(page)
  }, [page, fetchReservations])

  async function handleCancel(id: string) {
    setCancelling(id)
    try {
      const res = await fetch(`/api/reservations/my/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        // Optimistically update status in list
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r)),
        )
      }
    } finally {
      setCancelling(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">My Reservations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {total > 0
            ? `${total} reservation${total !== 1 ? "s" : ""} made`
            : "Your reservation history"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <UtensilsCrossed className="size-10 opacity-30" />
          <p className="text-sm">You haven&apos;t made any reservations yet.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/reservation">Book a table</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Reservation history">
          {reservations.map((res) => {
            const shortId = res.id.slice(0, 8).toUpperCase()
            const statusClass =
              reservationStatusColor[res.status] ??
              "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
            const canCancel = res.status === "Pending" || res.status === "Approved"

            return (
              <li
                key={res.id}
                className="rounded-xl border border-border bg-background/60 p-4 transition-colors hover:bg-background"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      #{shortId}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass}`}
                    >
                      {res.status}
                    </span>
                  </div>
                  {canCancel && (
                    <button
                      id={`cancel-reservation-${res.id}`}
                      onClick={() => handleCancel(res.id)}
                      disabled={cancelling === res.id}
                      className="flex items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                    >
                      {cancelling === res.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <X className="size-3" />
                      )}
                      Cancel
                    </button>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    <span className="truncate">{res.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UserRound className="size-3.5 shrink-0" />
                    <span>{res.guests} guest{res.guests !== 1 ? "s" : ""}</span>
                  </div>
                  {res.table && res.table !== "TBD" && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <UtensilsCrossed className="size-3.5 shrink-0" />
                      <span className="truncate">{res.table}</span>
                    </div>
                  )}
                </div>

                {(res.occasion || res.notes) && (
                  <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                    {res.occasion && <span className="font-medium">{res.occasion}</span>}
                    {res.occasion && res.notes && " · "}
                    {res.notes}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {!isLoading && total > pageSize && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              id="reservations-prev-btn"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              id="reservations-next-btn"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
