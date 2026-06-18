import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck, ChefHat, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { featuredDishes, homeServiceStats } from "@/lib/home.constant"

const HeroSection = () => {
  return (
    <section className="border-b bg-[linear-gradient(180deg,var(--color-primary-soft),transparent)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            <ChefHat className="size-4" />
            Restaurant website and management system
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-primary">আহার</span> brings Bengali dining and restaurant operations into one system.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            A customer-facing food ordering experience with reservations, secure checkout, order tracking, and a focused
            admin dashboard for daily restaurant operations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/menu">
                <Utensils />
                Order Online
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5">
              <Link href="/reservation">
                <CalendarCheck />
                Book a Table
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            {homeServiceStats.map((stat) => {
              const Icon = stat.icon

              return (
                <div key={stat.title} className="rounded-md border bg-card p-4">
                  <Icon className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-bold">{stat.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b bg-background/90 px-5 py-4 backdrop-blur">
            <Image
              src="/brand/ahar-with-text.png"
              alt="Ahar"
              width={160}
              height={70}
              className="h-12 w-auto object-contain"
              priority
            />
            <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
              Live orders active
            </span>
          </div>
          <div className="grid h-full min-h-[420px] content-end gap-3 bg-[radial-gradient(circle_at_top_right,var(--color-warning-soft),transparent_34%),linear-gradient(135deg,var(--color-card),var(--color-primary-soft))] p-5 pt-24">
            {featuredDishes.map((dish) => (
              <article key={dish.name} className="rounded-md border bg-background/92 p-4 shadow-sm backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-primary">{dish.category}</p>
                    <h2 className="mt-1 text-lg font-black">{dish.name}</h2>
                  </div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                    {dish.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{dish.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-primary">{dish.price}</span>
                  <Button size="sm" variant="outline">
                    Add
                    <ArrowRight />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
