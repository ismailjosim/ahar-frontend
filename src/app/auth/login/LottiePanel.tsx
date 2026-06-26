"use client"
import dynamic from "next/dynamic"
import { ShieldCheck, Zap, Clock } from "lucide-react"
import chefAnimation from "@/assets/animations/chef.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

const badges = [
  { icon: ShieldCheck, label: "Secure login" },
  { icon: Zap, label: "Instant access" },
  { icon: Clock, label: "Always on" },
]

export default function LottiePanel() {
  return (
    <div className="relative hidden w-1/2 flex-col overflow-hidden bg-primary lg:flex">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/5" />
        <div className="absolute bottom-10 left-10 size-64 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3" />
      </div>

      {/* Logo — fixed at top */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="font-bengali text-lg font-bold text-white">আ</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Ahar Bengal</span>
        </div>
      </div>

      {/* Center content — Lottie + copy stacked tight */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        {/* Circle backdrop behind animation */}
        <div className="relative flex items-center justify-center">
          <div className="absolute size-72 rounded-full bg-white/[0.07]" />
          <Lottie animationData={chefAnimation} loop autoplay className="relative z-10 max-w-96 drop-shadow-xl" />
        </div>

        {/* Copy sits immediately below animation — no gap class */}
        <div className="text-center">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Good to see you
            <br />
            <span className="text-white/50">back again.</span>
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
            Your restaurant doesn&apos;t stop — and neither does Ahar. Everything is right where you left it.
          </p>
        </div>
      </div>

      {/* Badges + tagline — fixed at bottom */}
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
          &ldquo;Your restaurant, running smoother every day.&rdquo;
        </p>
      </div>
    </div>
  )
}
