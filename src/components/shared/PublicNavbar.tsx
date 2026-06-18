import Link from "next/link"
import { Gauge, Moon, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { publicNavItems } from "@/lib/home.constant"

const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-secondary/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Ahar home">
          <div className="flex size-12 items-center justify-center rounded-xl border border-accent bg-primary shadow-lg shadow-primary/20">
            <span className="font-bengali text-2xl font-bold text-accent">আ</span>
          </div>
          <div>
            <p className="font-bengali flex items-center gap-1 text-2xl font-black tracking-wide text-primary">
              আহার
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-sans text-xs font-bold text-accent">
                PREMIUM
              </span>
            </p>
            <p className="text-xs tracking-wider text-foreground/60">Fine Dining & Catering</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-foreground/85 md:flex">
          {publicNavItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-primary">
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" className="flex items-center gap-1 text-accent transition hover:text-primary">
            <Gauge className="size-4" />
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-border bg-white/50 text-accent transition hover:scale-105 hover:bg-white"
            aria-label="Toggle theme"
          >
            <Moon className="size-5" />
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="relative size-10 rounded-full border-border bg-white/50 text-primary transition hover:scale-105 hover:bg-white"
          >
            <Link href="/cart" aria-label="Open cart">
              <ShoppingBag />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-accent bg-primary text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </Button>
          <Button
            asChild
            className="hidden rounded-full border border-accent/40 px-5 text-xs font-bold shadow-md shadow-primary/10 sm:inline-flex"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
