import Link from "next/link"
import { ArrowRight, Plus, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { featuredDishes } from "@/lib/home.constant"

const FeaturedDishesSection = () => {
  return (
    <section className="border-y border-border/30 bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Chef&apos;s Curated</span>
            <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">
              আমাদের জনপ্রিয় খাবারসমূহ (Popular Items)
            </h2>
          </div>
          <Link href="/menu" className="flex items-center gap-2 font-bold text-primary hover:underline">
            Browse Entire Menu
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDishes.map((dish) => (
            <article
              key={dish.name}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-accent/15 to-primary/10">
                <span className="text-7xl transition group-hover:scale-110">{dish.emoji}</span>
                <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {dish.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{dish.category}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-accent">
                    <Star className="size-3 fill-current" />
                    {dish.rating}
                  </span>
                </div>
                <h3 className="font-bengali text-lg font-extrabold leading-snug text-foreground">{dish.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{dish.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-black text-primary">{dish.price}</span>
                  <Button size="sm" className="rounded-full border border-accent/40">
                    <Plus />
                    Add
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDishesSection
