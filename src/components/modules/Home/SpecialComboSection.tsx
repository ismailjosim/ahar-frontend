import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

const SpecialComboSection = () => {
  return (
    <section className="motion-reveal motion-reveal-delay-1 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="motion-shimmer relative overflow-hidden rounded-3xl border border-accent bg-linear-to-br from-primary via-primary-hover to-primary p-8 text-white shadow-2xl md:p-12">
        <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 text-[220px] opacity-10 md:text-[300px]">
          🍲
        </div>
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-7">
            <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              Today&apos;s Special Combo Offer
            </span>
            <h2 className="font-bengali text-3xl font-extrabold leading-tight sm:text-4xl">
              শাহী কাচ্চি বিরিয়ানি ও বোরহানি উৎসব
            </h2>
            <p className="max-w-lg text-white/80">
              Indulge in our Premium Royal Mutton Kacchi Biryani, paired with signature Borhani and home-made Firni.
              Enough to satisfy a family of 3.
            </p>
            <div className="flex items-center gap-6 py-2">
              <div>
                <span className="block text-xs text-white/60">Regular Price</span>
                <span className="text-lg text-white/50 line-through">৳850</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-accent">Combo Special Offer</span>
                <span className="text-3xl font-black text-accent">
                  ৳590 <span className="text-sm">only</span>
                </span>
              </div>
            </div>
            <Button className="motion-scale-hover rounded-full border border-white/20 bg-accent px-8 py-6 font-black text-foreground shadow-lg hover:bg-accent/90">
              <ShoppingCart />
              Add Combo to Cart
            </Button>
          </div>
          <div className="animate-float flex justify-center text-[120px] md:col-span-5 sm:text-[160px]">🍗🍛🥤</div>
        </div>
      </div>
    </section>
  )
}

export default SpecialComboSection
