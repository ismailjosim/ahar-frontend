import Link from "next/link"
import { CalendarDays, Flame, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { homeServiceStats } from "@/lib/home.constant"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="space-y-6 text-center md:col-span-7 md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent sm:text-sm">
            <Flame className="size-4 text-primary" />
            Authentic Bengal Flavors & Royalty
          </span>

          <h1 className="font-bengali text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
            ঐতিহ্য ও স্বাদের অপূর্ব মেলবন্ধন <br />
            <span className="text-primary">আহার</span> রেস্টুরেন্ট
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:mx-0">
            Explore traditional recipes passed down through generations. From slow-cooked Kacchi Biryani to exquisite
            deshi delicacies, Ahar promises a premium fine-dining experience right in the heart of Bangladesh.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row md:justify-start">
            <Button
              asChild
              size="lg"
              className="h-14 w-full rounded-full border border-accent/50 px-8 text-base font-bold shadow-xl shadow-primary/30 transition hover:-translate-y-0.5 sm:w-auto"
            >
              <Link href="/menu">
                <Utensils />
                Order Online Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-full border-border bg-white px-8 text-base font-bold text-foreground shadow-md transition hover:bg-muted sm:w-auto"
            >
              <Link href="/reservation">
                <CalendarDays />
                Reserve Table
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
            {homeServiceStats.map((stat) => (
              <div key={stat.title}>
                <h2 className="font-bengali text-2xl font-extrabold text-primary">{stat.value}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center md:col-span-5">
          <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-gradient-to-tr from-accent/10 to-primary/5 blur-2xl" />
          <div className="animate-float relative flex size-80 items-center justify-center sm:size-96">
            <div className="absolute inset-0 rounded-full border-[18px] border-accent/10" aria-hidden="true" />
            <div className="absolute inset-8 rounded-full border border-accent/30" aria-hidden="true" />
            <div className="relative flex size-64 flex-col items-center justify-center overflow-hidden rounded-full border-4 border-accent bg-white p-4 text-center shadow-2xl sm:size-76">
              <span className="mb-2 text-7xl drop-shadow-lg sm:text-8xl">🍛</span>
              <span className="rounded-full border border-accent bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Signature Dish
              </span>
              <h3 className="mt-2 text-base font-bold text-foreground sm:text-lg">Kacchi Biryani Feast</h3>
              <p className="text-[11px] text-muted-foreground">Premium fragrant rice with tender mutton</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
