"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useState } from "react"
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageShell />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email.")
      return
    }

    if (!password) {
      setError("Please enter your password.")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      })

      if (signInError) {
        setError(signInError.message || "Unable to sign in with those credentials.")
        return
      }

      router.push(callbackURL)
      router.refresh()
    } catch {
      setError("Something went wrong while signing you in.")
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
            <h1 className="font-bengali text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to continue to your Ahar workspace.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>Email</span>
            <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="you@example.com"
                required
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
                autoComplete="current-password"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Your password"
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

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="size-4" aria-hidden="true" />
            )}
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          New to Ahar?{" "}
          <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
            Create an account
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
