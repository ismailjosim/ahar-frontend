"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, LogOut, ShoppingBag, UserRound, LayoutDashboard, User, Menu } from "lucide-react"

// shadcn ui components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <header className="sticky top-0 z-40 border-b border-border/50 bg-secondary/90 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between">
        {/* Logo Brand */}
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Ahar home"
        >
          <div className="flex size-12 items-center justify-center rounded-xl border border-accent bg-primary shadow-lg shadow-primary/20">
            <span className="font-bengali text-2xl font-bold text-accent">আ</span>
          </div>
          <div>
            <p className="font-bengali flex items-center gap-2 text-2xl font-black tracking-wide text-primary">
              আহার
              <Badge
                variant="outline"
                className="border-accent/30 bg-accent/10 font-sans text-[10px] font-bold text-accent px-2 py-0"
              >
                PREMIUM
              </Badge>
            </p>
            <p className="text-xs tracking-wider text-foreground/60">Fine Dining & Catering</p>
          </div>
        </Link>

        {/* Desktop Navigation Links (Hidden on Mobile) */}
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

        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler />

          {/* Cart Icon Button */}
          <Button
            asChild
            variant="outline"
            size="icon"
            className="relative size-10 rounded-full border-border bg-card text-primary hover:bg-muted transition-transform active:scale-95"
          >
            <Link href="/cart" aria-label="Open cart">
              <ShoppingBag className="size-5" />
              <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-accent bg-primary p-0 text-[10px] font-bold text-white hover:bg-primary">
                0
              </Badge>
            </Link>
          </Button>

          {/* DESKTOP ONLY: Authentication Displays */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-border bg-card pl-1.5 pr-3 text-xs font-bold text-foreground hover:bg-muted gap-2 transition-all active:scale-95"
                  >
                    <Avatar className="size-7">
                      <AvatarImage src={user.image ?? undefined} alt={user.name || "User profile"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <UserRound className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-24 truncate">{user.name || user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-1">
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="size-4 text-muted-foreground" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                      <LayoutDashboard className="size-4 text-muted-foreground" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
                  >
                    <LogOut className="size-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                disabled={isPending}
                className="rounded-full border border-accent/40 px-5 text-xs font-bold shadow-md shadow-primary/10 transition-transform active:scale-95"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* MOBILE ONLY: Global Universal Dropdown Menu (Handles Logged-In & Logged-Out views seamlessly) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-border bg-card text-foreground hover:bg-muted md:hidden transition-transform active:scale-95"
                aria-label="Toggle menu"
              >
                {user ? (
                  <Avatar className="size-7">
                    <AvatarImage src={user.image ?? undefined} alt={user.name || "User profile"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-1 md:hidden">
              {user && (
                <>
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuLabel className="text-[10px] font-bold tracking-wider text-muted-foreground/70 px-2 py-1 uppercase">
                Navigation
              </DropdownMenuLabel>
              {publicNavItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild className="rounded-xl cursor-pointer">
                  <Link
                    href={item.href}
                    className={cn("w-full text-sm", isActiveRoute(item.href) && "text-primary font-bold bg-primary/5")}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              {user ? (
                <>
                  <DropdownMenuLabel className="text-[10px] font-bold tracking-wider text-muted-foreground/70 px-2 py-1 uppercase">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4 text-muted-foreground" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
                  >
                    <LogOut className="size-4" /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer focus:bg-primary focus:text-white bg-primary/10 text-primary font-semibold"
                >
                  <Link href="/auth/login" className="w-full text-center justify-center">
                    Sign In
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
