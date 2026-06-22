"use client"

/**
 * NavUser.tsx
 *
 * Bottom sidebar section — user profile card, theme toggle, and logout.
 * Mirrors WellSpace's nav-user.tsx decomposition pattern.
 */

import Link from "next/link"
import { LogOut, UserRound } from "lucide-react"

import ThemeToggler from "@/components/shared/ThemeToggler"
import { authClient } from "@/lib/auth-client"

interface NavUserProps {
  onNavClick?: () => void
}

export default function NavUser({ onNavClick }: NavUserProps) {
  const { data: session } = authClient.useSession()
  const user = session?.user

  async function handleSignOut() {
    await authClient.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <div className="space-y-3 border-t border-border bg-card p-4">
      {/* User profile link */}
      <Link
        href="/profile"
        onClick={onNavClick}
        className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-2.5 transition hover:bg-muted"
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-secondary/30 bg-primary bg-cover bg-center font-bengali font-bold text-primary-foreground"
          style={user?.image ? { backgroundImage: `url("${user.image}")` } : undefined}
        >
          {!user?.image && <UserRound className="size-5" aria-hidden="true" />}
        </span>

        <span className="min-w-0 overflow-hidden text-left">
          <span className="block truncate text-sm font-semibold text-foreground">{user?.name ?? "Profile"}</span>
          <span className="block truncate text-xs font-semibold text-muted-foreground">
            {user?.email ?? "Signed in"}
          </span>
        </span>
      </Link>

      {/* Theme toggle + logout */}
      <div className="flex items-center justify-between gap-2">
        <ThemeToggler />

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-primary"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
}
