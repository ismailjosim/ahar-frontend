import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  ChefHat,
  Clock3,
  MapPin,
  Menu,
  PackageCheck,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservations", href: "/reservation" },
  { label: "Track Order", href: "/order-tracking" },
]

const featuredDishes = [
  {
    name: "Royal Mutton Kacchi",
    category: "Biryani",
    price: "৳420",
    description: "Fragrant chinigura rice, tender mutton, potato, and house spice blend.",
    badge: "Best Seller",
  },
  {
    name: "Shorshe Ilish",
    category: "Fish",
    price: "৳520",
    description: "Hilsa cooked in mustard, green chili, and slow-steamed Bengali gravy.",
    badge: "Signature",
  },
  {
    name: "Chicken Roast Combo",
    category: "Combo",
    price: "৳360",
    description: "Classic roast chicken with polao, salad, borhani, and dessert.",
    badge: "Popular",
  },
]

const orderSteps = [
  {
    title: "Browse Menu",
    text: "Explore categories, featured dishes, add-ons, and real-time availability.",
    icon: Menu,
  },
  {
    title: "Build Cart",
    text: "Select variants, adjust quantity, apply coupons, and review delivery totals.",
    icon: ShoppingBag,
  },
  {
    title: "Track Live",
    text: "Follow every order from placed to preparing, ready, dispatched, and delivered.",
    icon: PackageCheck,
  },
]

const stats = [
  { label: "Today Sales", value: "৳48.5k" },
  { label: "Live Orders", value: "18" },
  { label: "Reservations", value: "12" },
  { label: "Menu Items", value: "86" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Ahar home">
            <Image
              src="/brand/ahar-favicon.png"
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-md object-contain"
              priority
            />
            <div>
              <p className="text-xl font-black text-primary">আহার</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Premium Bengali Dining
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/dashboard">
                <BarChart3 />
                Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/cart">
                <ShoppingBag />
                Cart
              </Link>
            </Button>
          </div>
        </div>
      </header>

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
              <div className="rounded-md border bg-card p-4">
                <Clock3 className="mb-3 size-5 text-primary" />
                <p className="text-sm font-bold">Open Daily</p>
                <p className="mt-1 text-xs text-muted-foreground">10:00 AM - 11:00 PM</p>
              </div>
              <div className="rounded-md border bg-card p-4">
                <MapPin className="mb-3 size-5 text-primary" />
                <p className="text-sm font-bold">Dhaka Service</p>
                <p className="mt-1 text-xs text-muted-foreground">Delivery and pickup</p>
              </div>
              <div className="rounded-md border bg-card p-4">
                <Star className="mb-3 size-5 text-primary" />
                <p className="text-sm font-bold">4.9 Rating</p>
                <p className="mt-1 text-xs text-muted-foreground">Customer favorites</p>
              </div>
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
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-md border bg-background p-4">
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
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
                {["#AH-8762 Preparing", "#AH-8763 Pending", "#AH-8764 Out for delivery"].map((order) => (
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

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xl font-black text-primary">আহার (Ahar)</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Premium Bengali dining website and restaurant management platform.
            </p>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">2026 Ahar Restaurant Systems</p>
        </div>
      </footer>
    </main>
  )
}
