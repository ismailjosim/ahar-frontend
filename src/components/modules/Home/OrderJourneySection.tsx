import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { orderSteps } from "@/lib/home.constant"

const OrderJourneySection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-primary">Order Journey</p>
          <h2 className="mt-2 text-3xl font-black">Simple flow for customers and staff</h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/menu">
            Browse Entire Menu
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {orderSteps.map((step, index) => {
          const Icon = step.icon

          return (
            <article key={step.title} className="rounded-md border bg-card p-6">
              <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OrderJourneySection
