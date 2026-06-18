"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, ClipboardList, PackageCheck, Phone, Search, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { orderStatusDescriptions, orderStatusLabels, orderStatusSequence } from "@/lib/order.constant"
import { cn } from "@/lib/utils"
import type { AdminOrderRow } from "@/types/dashboard.interface"

export default function OrderTrackingPageContent() {
  const [orderId, setOrderId] = useState("1024")
  const [phone, setPhone] = useState("")
  const [order, setOrder] = useState<AdminOrderRow | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setOrder(null)

    if (!orderId.trim()) {
      setError("Enter an order ID.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`)
      if (!res.ok) {
        setError("No order was found for that ID.")
        return
      }

      const data: AdminOrderRow = await res.json()
      const enteredPhone = phone.trim()
      if (enteredPhone && !data.phone.endsWith(enteredPhone.replace(/^\+?880|^0/, "")) && data.phone !== enteredPhone) {
        setError("The phone number does not match this order.")
        return
      }

      setOrder(data)
    } catch {
      setError("Could not load the order right now.")
    } finally {
      setLoading(false)
    }
  }

  const activeIndex = order
    ? order.status === "Cancelled"
      ? -1
      : Math.max(0, orderStatusSequence.indexOf(order.status))
    : -1

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="motion-reveal mb-8">
        <nav className="mb-3 flex text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <Link href="/" className="cursor-pointer transition hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Track Order</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="font-bengali flex items-center gap-3 text-3xl font-black leading-tight sm:text-4xl">
              <Truck className="size-8 text-primary" />
              অর্ডার ট্র্যাক করুন
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Enter your order ID and optional phone number to follow the current kitchen and delivery progress.
            </p>
          </div>

          <form onSubmit={handleLookup} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="grid gap-3">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Order ID</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="1024"
                />
              </div>
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Phone optional
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="01755112233"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-11 rounded-xl">
                <Search className="size-4" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {order ? (
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm lg:col-span-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Order #{order.id}</p>
                <h2 className="font-bengali mt-1 text-2xl font-black">{orderStatusLabels[order.status]}</h2>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-black",
                  order.status === "Cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary-soft text-primary",
                )}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {orderStatusSequence.map((status, index) => {
                const isDone = activeIndex >= index
                const isCurrent = activeIndex === index

                return (
                  <div key={status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border-2",
                          isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {isDone ? <CheckCircle2 className="size-5" /> : index + 1}
                      </span>
                      {index < orderStatusSequence.length - 1 && (
                        <span className={cn("h-10 w-0.5", isDone ? "bg-primary" : "bg-border")} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={cn("font-bengali font-black", isCurrent && "text-primary")}>
                        {orderStatusLabels[status]}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{orderStatusDescriptions[status]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
              <PackageCheck className="size-9 text-primary" />
              <h3 className="font-bengali mt-3 text-xl font-black">Order Summary</h3>
              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Customer" value={order.customer} />
                <SummaryRow label="Phone" value={order.phone} />
                <SummaryRow label="Items" value={order.items} />
                <SummaryRow label="Payment" value={order.method} />
                <SummaryRow label="Type" value={order.type} />
                <SummaryRow label="Total" value={`৳${order.total}`} />
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/70 p-10 text-center">
          <p className="font-bengali text-xl font-black">Search an order to see live progress</p>
          <p className="mt-2 text-sm text-muted-foreground">Try demo order IDs 1024, 1023, 1022, or 1021.</p>
        </div>
      )}
    </div>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-bold">{value}</span>
  </div>
)
