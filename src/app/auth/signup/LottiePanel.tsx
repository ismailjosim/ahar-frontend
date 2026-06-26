"use client"
import dynamic from "next/dynamic"
import { UtensilsCrossed, ChartBar, Users, ArrowLeft } from "lucide-react"
import chefMakingPizza from "@/assets/animations/chef-making-pizza.json"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

const badges = [
  { icon: UtensilsCrossed, label: "Menu management" },
  { icon: ChartBar, label: "Sales analytics" },
  { icon: Users, label: "Team access" },
]

export default function LottiePanel() {
  return (
    <div className="relative hidden w-1/2 flex-col overflow-hidden bg-primary lg:flex">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-80 rounded-full bg-white/5" />
        <div className="absolute bottom-10 right-10 size-64 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3" />
      </div>

      {/* Top bar — back button + logo */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to home
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="font-bengali text-lg font-bold text-white">আ</span>
          </div>
          <span className="font-bengali text-4xl font-semibold tracking-tight text-white">আহার</span>
        </div>
      </div>

      {/* Center — Lottie + copy */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute size-72 rounded-full bg-white/[0.07]" />
          <Lottie
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
            }}
            animationData={chefMakingPizza}
            loop
            autoplay
            className="relative z-10 max-w-96 drop-shadow-xl"
          />
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Run your restaurant
            <br />
            <span className="text-white/50">with clarity.</span>
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
            Everything your team needs — menus, orders, analytics — in one focused workspace.
          </p>
        </div>
      </div>

      {/* Bottom — badges + tagline */}
      <div className="relative z-10 space-y-3 p-8 pt-0">
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2"
            >
              <Icon className="size-4 text-white/70" />
              <span className="text-xs text-white/70">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs italic text-white/25">
          &ldquo;Built for Bangladeshi restaurant owners who mean business.&rdquo;
        </p>
      </div>
    </div>
  )
}
