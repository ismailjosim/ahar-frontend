import Link from "next/link"
import { ArrowRight, Plus, Star } from "lucide-react"

// shadcn ui components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { featuredDishes } from "@/lib/home.constant"

const FeaturedDishesSection = () => {
  return (
    <section className="border-y border-border/30 bg-muted/30 py-12">
      <div className="mx-auto container">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Chef&apos;s Curated</span>
            <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">
              আমাদের জনপ্রিয় খাবারসমূহ (Popular Items)
            </h2>
          </div>
          <Link
            href="/menu"
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Browse Entire Menu
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDishes.map((dish) => (
            <article
              key={dish.name}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Product Visual Top */}
              <div className="relative flex h-40 items-center justify-center bg-linear-to-br from-accent/15 to-primary/10">
                <span className="text-7xl select-none transition-transform duration-300 group-hover:scale-110">
                  {dish.emoji}
                </span>
                <Badge
                  variant="outline"
                  className="absolute left-3 top-3 border-accent/40 bg-primary font-sans text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5"
                >
                  {dish.badge}
                </Badge>
              </div>

              {/* Product Info Block */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{dish.category}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-accent">
                    <Star className="size-3 fill-current" />
                    {dish.rating}
                  </span>
                </div>

                <h3 className="font-bengali text-lg font-extrabold leading-snug text-foreground">{dish.name}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{dish.description}</p>

                {/* Product Action Footer */}
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-xl font-black text-primary tracking-tight">{dish.price}</span>
                  <Button
                    size="sm"
                    className="rounded-full border border-accent/40 px-4 font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <Plus className="size-4" />
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
