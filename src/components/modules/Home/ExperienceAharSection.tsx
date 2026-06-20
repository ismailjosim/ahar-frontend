import Image from "next/image"
import { ChefHat, Leaf, Soup, Images, MapPin } from "lucide-react"

// shadcn ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import interior from "@/assets/interior.jpg"
import chef from "@/assets/chef-02.jpg"
import family from "@/assets/family-02.jpg"
import Link from "next/link"

const experiences = [
  {
    title: "Authentic Bengali Cuisine",
    description: "Traditional recipes passed down through generations with authentic flavors.",
    icon: Soup,
    image: interior,
  },
  {
    title: "Premium Ingredients",
    description: "Carefully selected fresh ingredients to maintain the true taste of Bengal.",
    icon: Leaf,
    image: chef,
  },
  {
    title: "Traditional Cooking Method",
    description: "Slow cooked dishes prepared with heritage techniques and passion.",
    icon: ChefHat,
    image: family,
  },
]

export default function ExperienceAharSection() {
  return (
    <section className="relative py-24 bg-secondary/40 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Heading Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Badge
            variant="secondary"
            className="uppercase tracking-[0.3em] text-primary font-semibold mb-4 hover:bg-secondary"
          >
            Experience Ahar
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            আহারের সাথে থাকুক
            <span className="block text-primary mt-2">স্বাদ, ঐতিহ্য ও ভালোবাসা</span>
          </h2>

          <p className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed">
            Experience authentic Bengali dining where traditional recipes, premium ingredients and warm hospitality come
            together.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.title}
                className="group overflow-hidden rounded-3xl border-border bg-card shadow-sm transition-all duration-300 p-0 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-4/3  overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>

                {/* Card Content */}
                <CardHeader className="p-6 pb-2">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={25} />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-4">
          {/* First Button: View Gallery (Hero Section Style: Primary Filled) */}
          <Button
            asChild
            size="lg"
            className="py-6 w-full rounded-full border border-accent/50 px-8 text-base font-bold shadow-xl shadow-primary/30 sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/gallery">
              <Images className="mr-2 size-5" />
              View Gallery
            </Link>
          </Button>

          {/* Second Button: Visit Us (Hero Section Style: Premium Outline) */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="py-6 w-full rounded-full border-border bg-card px-8 text-base font-bold text-foreground shadow-md hover:bg-muted sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/contact">
              <MapPin className="mr-2 size-5 text-accent" />
              Visit Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
