"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import Link from "next/link"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginInput = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackURL = params.get("callbackURL") ?? "/dashboard"
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ismailjosim99@gmail.com", password: "Mdjasim99@" },
  })

  const onSubmit: SubmitHandler<LoginInput> = async (values) => {
    setServerError("")
    setLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL,
      })
      if (error) {
        setServerError(error.message as string)
        return
      }
      router.push(callbackURL)
      router.refresh()
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setServerError("")
    setGoogleLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      })
    } catch {
      setServerError("Google sign-in failed. Please try again.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={googleLoading}
        onClick={handleGoogleLogin}
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or sign in with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email / password form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
        )}

        <Field>
          <FieldLabel>Email address</FieldLabel>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
            <Input {...form.register("email")} type="email" defaultValue={"ismailjosim99@gmail.com"} placeholder="you@example.com" className="pl-9" />
          </div>
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Password</FieldLabel>
            <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
            <Input
              {...form.register("password")}
              defaultValue={"Mdjasim99@"}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError errors={[form.formState.errors.password]} />
        </Field>

        <Button disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  )
}
