import Link from "next/link"
import { ArrowRight, BarChart3, CalendarCheck, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { dashboardStats, liveOrderPreview } from "@/lib/home.constant"

const ManagementPreviewSection = () => {
  return (
    <section className="border-y border-border/30 bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-accent">Reservation & Admin Preview</p>
          <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">
            বুকিং, অর্ডার ও রেস্টুরেন্ট অপারেশন এক জায়গায়।
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The demo includes order control, menu management, reservations, payments, reports, inventory, and settings.
            This foundation keeps those screens in the roadmap while the public layout comes online first.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full border border-accent/40 px-6">
              <Link href="/dashboard">
                <BarChart3 />
                Open Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border bg-white px-6">
              <Link href="/reservation">
                Book Table
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-4">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="size-5 text-primary" />
                <h3 className="font-black">Live Restaurant Orders</h3>
              </div>
              <div className="space-y-3">
                {liveOrderPreview.map((order) => (
                  <div key={order} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
                    <span className="font-semibold">{order}</span>
                    <Button size="xs" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-5 text-accent" />
                  <h3 className="font-black">Table Reservations</h3>
                </div>
                <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning-foreground">
                  Pending
                </span>
              </div>
              <div className="space-y-3">
                {["Table 04 - 7:30 PM", "Family Booth - 8:15 PM", "Window Seat - 9:00 PM"].map((reservation) => (
                  <div key={reservation} className="rounded-xl bg-muted px-4 py-3 text-sm font-semibold">
                    {reservation}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManagementPreviewSection
