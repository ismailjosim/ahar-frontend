import { ShoppingCart } from "lucide-react"

// shadcn ui components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SpecialComboSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-accent bg-linear-to-br from-primary via-primary/95 to-primary p-8 text-white shadow-2xl md:p-12">
        {/* Background Decorative Emoji */}
        <div
          className="absolute bottom-0 right-0 translate-x-12 translate-y-12 text-[220px] opacity-10 md:text-[300px] select-none pointer-events-none"
          aria-hidden="true"
        >
          🍲
        </div>

        <div className="relative z-10 grid items-center gap-8 md:grid-cols-12">
          {/* Offer Details */}
          <div className="space-y-4 md:col-span-7">
            <Badge className="bg-accent text-foreground hover:bg-accent/95 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider border-none pointer-events-none">
              Today&apos;s Special Combo Offer
            </Badge>

            <h2 className="font-bengali text-3xl font-extrabold leading-tight sm:text-4xl">
              শাহী কাচ্চি বিরিয়ানি ও বোরহানি উৎসব
            </h2>

            <p className="max-w-lg text-white/80 text-sm sm:text-base leading-relaxed">
              Indulge in our Premium Royal Mutton Kacchi Biryani, paired with signature Borhani and home-made Firni.
              Enough to satisfy a family of 3.
            </p>

            {/* Pricing Tiers */}
            <div className="flex items-center gap-6 py-2">
              <div>
                <span className="block text-xs text-white/60">Regular Price</span>
                <span className="text-lg text-white/50 line-through font-medium">৳850</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-accent">Combo Special Offer</span>
                <span className="text-3xl font-black text-accent tracking-tight">
                  ৳590 <span className="text-sm font-normal text-accent/90">only</span>
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <Button
              size="lg"
              className="rounded-full border border-white/10 bg-accent px-8 py-6 text-base font-black text-foreground shadow-xl shadow-black/10 hover:bg-accent/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="size-5" />
              Add Combo to Cart
            </Button>
          </div>

          {/* Hero Visual Emojis */}
          <div
            className="animate-float flex justify-center text-[110px] md:col-span-5 sm:text-[140px] tracking-tighter select-none"
            aria-hidden="true"
          >
            <h3>🍗🍛🥤</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpecialComboSection
