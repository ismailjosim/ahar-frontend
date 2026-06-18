import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { dashboardStats, liveOrderPreview } from "@/lib/home.constant"

const ManagementPreviewSection = () => {
  return (
    <section className="border-y bg-muted/45">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-primary">Management Preview</p>
          <h2 className="mt-2 text-3xl font-black">Admin operations are planned from day one.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The demo includes order control, menu management, reservations, payments, reports, inventory, and settings.
            This foundation keeps those screens in the roadmap while the public layout comes online first.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">
                <BarChart3 />
                Open Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/order-tracking">
                Track Order
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-4">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-md border bg-background p-4">
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black">Live Restaurant Orders</h3>
              <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning-foreground">
                Kitchen queue
              </span>
            </div>
            <div className="space-y-3">
              {liveOrderPreview.map((order) => (
                <div key={order} className="flex items-center justify-between rounded-md bg-muted px-4 py-3 text-sm">
                  <span className="font-semibold">{order}</span>
                  <Button size="xs" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManagementPreviewSection
