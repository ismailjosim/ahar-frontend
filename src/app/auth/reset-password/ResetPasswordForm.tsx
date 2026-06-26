"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock, CircleCheck, TriangleAlert } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import Link from "next/link"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })

type FormInput = z.infer<typeof schema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState("")

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  // Token missing or expired — show a clear error immediately
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="size-7 text-destructive" />
        </div>
        <div>
          <p className="font-semibold">Invalid or expired link</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This reset link is no longer valid. Request a new one below.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/forgot-password">Request a new link</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
          <CircleCheck className="size-7 text-green-600" />
        </div>
        <div>
          <p className="font-semibold">Password updated</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your password has been changed. You can now sign in with your new password.
          </p>
        </div>
        <Button className="w-full" onClick={() => router.push("/auth/login")}>
          Go to sign in
        </Button>
      </div>
    )
  }

  const onSubmit: SubmitHandler<FormInput> = async ({ password }) => {
    setServerError("")
    setLoading(true)
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (error) {
        setServerError(error.message ?? "Something went wrong. Please try again.")
        return
      }
      setDone(true)
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}

      <Field>
        <FieldLabel>New password</FieldLabel>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
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

      <Field>
        <FieldLabel>Confirm new password</FieldLabel>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            {...form.register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your new password"
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <FieldError errors={[form.formState.errors.confirmPassword]} />
      </Field>

      <Button disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Update password
      </Button>
    </form>
  )
}
