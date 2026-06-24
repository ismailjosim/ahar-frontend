"use client"

import { FormEvent, Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, UserRound, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { normalizeBDPhone, validateBDPhone } from "@/lib/phone.utils"

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthPageShell />}>
      <SignUpForm />
    </Suspense>
  )
}

const roleLabels: Record<string, string> = {
  cashier: "Cashier (ক্যাশিয়ার)",
  kitchen: "Kitchen Staff (কিচেন স্টাফ)",
  manager: "Manager (ম্যানেজার)",
  owner: "Owner (মালিক)",
  super_admin: "Super Admin (সুপার এডমিন)",
}

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get("invite")
  const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"))

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Invite states
  const [invitedRole, setInvitedRole] = useState("")
  const [inviteEmailLocked, setInviteEmailLocked] = useState(false)

  useEffect(() => {
    if (!inviteToken) return

    async function checkInvite() {
      try {
        const res = await fetch(`/api/staff/invite/${inviteToken}`)
        const json = await res.json()
        if (res.ok && json) {
          setEmail(json.email)
          setInvitedRole(json.role)
          setInviteEmailLocked(true)
        } else {
          setError("Your staff invite link is invalid or has expired.")
        }
      } catch {
        setError("Unable to validate staff invite token.")
      }
    }

    checkInvite()
  }, [inviteToken])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (phone && !validateBDPhone(phone)) {
      setError("Please enter a valid Bangladeshi phone number.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone ? normalizeBDPhone(phone) : undefined,
        callbackURL: inviteToken ? "/dashboard" : callbackURL,
      } as Parameters<typeof authClient.signUp.email>[0])

      if (signUpError) {
        setError(signUpError.message || "Unable to create your account.")
        return
      }

      // If signed up via invite, mark invite as used to trigger role promotion on server
      if (inviteToken) {
        await fetch(`/api/staff/invite/${inviteToken}/use`, {
          method: "PATCH",
        })
        router.push("/dashboard")
      } else {
        router.push(callbackURL)
      }
      router.refresh()
    } catch {
      setError("Something went wrong while creating your account.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Utensils className="size-5" aria-hidden="true" />
          </div>

          <div>
            <h1 className="font-bengali text-2xl font-bold">Create account</h1>
            <p className="text-sm text-muted-foreground">Join Ahar and manage your restaurant workspace.</p>
          </div>
        </div>

        {invitedRole && (
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-primary">
            You have been invited as a <span className="underline">{roleLabels[invitedRole] || invitedRole}</span>. 
            Signing up will join you as staff.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>Name</span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Your name"
                required
              />
            </span>
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Email</span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 disabled:opacity-60">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:text-muted-foreground disabled:cursor-not-allowed"
                placeholder="you@example.com"
                required
                disabled={inviteEmailLocked}
              />
            </span>
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>
              Phone number <span className="text-muted-foreground font-normal">(optional)</span>
            </span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="01712345678"
              />
            </span>
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Password</span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-muted-foreground transition hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </span>
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Confirm password</span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Repeat password"
                required
              />
            </span>
          </label>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}

function AuthPageShell() {
  return <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-foreground" />
}

function getSafeCallbackURL(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard"
  }

  return value
}
