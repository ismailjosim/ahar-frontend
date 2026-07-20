"use client"

import Image from "next/image"
import { Utensils } from "lucide-react"
import { Category } from "@/types/category.interface"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface MenuCategoriesFilterBubbleProps {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const MenuCategoriesFilterBubble = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: MenuCategoriesFilterBubbleProps) => {
  const handleSelectionChange = (value: string) => {
    if (value) setSelectedCategory(value)
  }

  return (
    <section className="w-full space-y-3">
      <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Categories</h3>

      <ScrollArea className="w-full whitespace-nowrap pb-3">
        <ToggleGroup
          type="single"
          value={selectedCategory}
          onValueChange={handleSelectionChange}
          className="flex items-center justify-start gap-4 w-max p-1"
        >
          {/* Static "All Menu" Option */}
          <ToggleGroupItem
            value="all"
            aria-label="Filter by All Menu"
            className="flex flex-col items-center gap-2 h-auto w-auto p-0 bg-transparent data-[state=on]:bg-transparent hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary/50 group cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary scale-105"
                  : "bg-card border-border group-hover:border-primary/40 group-hover:scale-105 text-card-foreground"
              }`}
            >
              <Utensils
                className={`w-6 h-6 transition-colors ${
                  selectedCategory === "all"
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
            </div>
            <span
              className={`text-xs font-bold transition-colors ${
                selectedCategory === "all" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`}
            >
              All Menu
            </span>
          </ToggleGroupItem>

          {/* Dynamic API Categories Mapping */}
          {categories?.map((cat) => {
            const isActive = selectedCategory === cat.id

            return (
              <ToggleGroupItem
                key={cat.id}
                value={cat.id}
                aria-label={`Filter by ${cat.name}`}
                className="flex flex-col items-center gap-2 h-auto w-auto p-0 bg-transparent data-[state=on]:bg-transparent hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary/50 group cursor-pointer transition-transform active:scale-95 shrink-0"
              >
                {/* Bubble Frame (Added overflow-hidden & relative for proper Image positioning) */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden relative transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary scale-105"
                      : "bg-card border-border group-hover:border-primary/40 group-hover:scale-105 text-card-foreground"
                  }`}
                >
                  {/* 1. Priority: Main Category Image Coverage */}
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill sizes="64px" className="object-cover" />
                  ) : cat.icon ? (
                    /* 2. Secondary Priority: Emoji or Code String Icon */
                    <span className="text-2xl select-none z-10">{cat.icon}</span>
                  ) : (
                    /* 3. Safety Fallback: Default Utility Icon */
                    <Utensils
                      className={`w-5 h-5 transition-colors z-10 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                      }`}
                    />
                  )}
                </div>

                <span
                  className={`text-xs font-bold transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {cat.name}
                </span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </section>
  )
}

export default MenuCategoriesFilterBubble
