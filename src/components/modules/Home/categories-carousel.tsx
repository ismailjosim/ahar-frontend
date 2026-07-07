"use client"

import Image from "next/image"
import Link from "next/link"
import { useAnimate } from "motion/react"
import { UtensilsCrossed } from "lucide-react"
import { Category } from "@/types/category.interface"
import { useEffect, useMemo, useRef } from "react"

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/menu?category=${category.slug}`}
      className="motion-soft-hover group flex w-55 shrink-0 flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm hover:border-primary/30 hover:shadow-lg sm:w-60"
    >
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        {category.image ? (
          <Image src={category.image} alt={category.name} fill sizes="64px" className="object-cover" />
        ) : category.icon ? (
          <span className="text-2xl leading-none" aria-hidden="true">
            {category.icon}
          </span>
        ) : (
          <UtensilsCrossed className="h-7 w-7" strokeWidth={1.75} />
        )}
      </span>

      <div className="space-y-1">
        <h3 className="font-heading text-base font-semibold text-foreground">{category.name}</h3>
        {category.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{category.description}</p>
        ) : null}
      </div>
    </Link>
  )
}

export function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const [scope, animate] = useAnimate()
  const controls = useRef<ReturnType<typeof animate> | null>(null)
  const track = useMemo(() => [...categories, ...categories], [categories])

  useEffect(() => {
    controls.current = animate(
      scope.current,
      { x: ["0%", "-50%"] },
      {
        duration: Math.max(categories.length * 4, 12),
        ease: "linear",
        repeat: Infinity,
      },
    )

    return () => controls.current?.stop()
  }, [categories.length])

  return (
    <div className="relative container mx-auto overflow-hidden">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-secondary to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-secondary to-transparent sm:w-28" />

      <div
        ref={scope}
        className="flex w-max gap-6 px-6"
        onMouseEnter={() => controls.current?.pause()}
        onMouseLeave={() => controls.current?.play()}
      >
        {track.map((category, index) => (
          <CategoryCard key={`${category.id}-${index}`} category={category} />
        ))}
      </div>
    </div>
  )
}
