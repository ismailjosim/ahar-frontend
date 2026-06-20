import { ArrowRight, Utensils } from "lucide-react"

export default function MenuPreviewSection() {
  const categories = [
    { name: "Traditional Thali", count: "8 Items", icon: "🍛" },
    { name: "Biryani & Pulao", count: "5 Items", icon: "🍲" },
    { name: "Bengal Desserts", count: "6 Items", icon: "🍯" },
    { name: "Starters & Snacks", count: "12 Items", icon: "🍢" },
  ]

  return (
    <section className="motion-reveal py-20 bg-muted/50 border-t border-b border-border/60">
      <div className="container mx-auto text-center">
        <span className="text-accent font-semibold tracking-wider uppercase text-sm block mb-2">Flavorful Journey</span>
        <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4 font-bengali">
          Explore Our Premium Menu
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          From heritage recipes passed down through generations to modern interpretations of Bengali fine dining.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className="motion-soft-hover bg-card p-6 rounded-lg border border-border/80 shadow-sm flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="text-4xl mb-4 p-4 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-1 font-bengali">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </div>
          ))}
        </div>

        <button className="motion-scale-hover inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary-hover transition-colors shadow-md">
          View Full Menu <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
