"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, LogOut, ShoppingBag, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { publicNavItems } from "@/lib/home.constant"
import ThemeToggler from "@/components/shared/ThemeToggler"
import { authClient } from "@/lib/auth-client"

const PublicNavbar = () => {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleSignOut() {
    await authClient.signOut()
    window.location.href = "/auth/login"
  }

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === href
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="motion-reveal sticky top-0 z-40 border-b border-border/50 bg-secondary/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="motion-scale-hover flex cursor-pointer items-center gap-3" aria-label="Ahar home">
          <div className="flex size-12 items-center justify-center rounded-xl border border-accent bg-primary shadow-lg shadow-primary/20 transition-transform duration-300">
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
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActiveRoute(item.href) ? "page" : undefined}
              className={cn(
                "relative cursor-pointer py-2 transition duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-200 hover:text-primary hover:after:scale-x-100",
                isActiveRoute(item.href) && "text-primary after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              aria-current={isActiveRoute("/dashboard") ? "page" : undefined}
              className={cn(
                "relative flex cursor-pointer items-center gap-1 py-2 text-accent transition duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-200 hover:text-primary hover:after:scale-x-100",
                isActiveRoute("/dashboard") && "text-primary after:scale-x-100",
              )}
            >
              <Gauge className="size-4" />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggler />
          <Button
            asChild
            variant="outline"
            size="icon"
            className="motion-scale-hover relative size-10 rounded-full border-border bg-card text-primary hover:bg-muted"
          >
            <Link href="/cart" aria-label="Open cart">
              <ShoppingBag />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-accent bg-primary text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </Button>
          {user ? (
            <>
              <Button
                asChild
                variant="outline"
                className="motion-scale-hover hidden h-10 rounded-full border-border bg-card px-3 text-xs font-bold text-foreground hover:bg-muted sm:inline-flex"
              >
                <Link href="/profile" aria-label="Open profile">
                  <span
                    className="flex size-6 items-center justify-center rounded-full bg-primary-soft bg-cover bg-center text-primary"
                    style={user.image ? { backgroundImage: `url("${user.image}")` } : undefined}
                  >
                    {!user.image && <UserRound className="size-4" />}
                  </span>
                  <span className="max-w-28 truncate">{user.name || user.email}</span>
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSignOut}
                className="motion-scale-hover size-10 rounded-full border-border bg-card text-primary hover:bg-muted"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              disabled={isPending}
              className="motion-scale-hover hidden rounded-full border border-accent/40 px-5 text-xs font-bold shadow-md shadow-primary/10 sm:inline-flex"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
