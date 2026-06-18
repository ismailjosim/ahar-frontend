import Image from "next/image"
import Link from "next/link"
import { BarChart3, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { publicNavItems } from "@/lib/home.constant"

const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Ahar home">
          <Image
            src="/brand/ahar-favicon.png"
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-md object-contain"
            priority
          />
          <div>
            <p className="text-xl font-black text-primary">আহার</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Premium Bengali Dining
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          {publicNavItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/dashboard">
              <BarChart3 />
              Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/cart">
              <ShoppingBag />
              Cart
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
