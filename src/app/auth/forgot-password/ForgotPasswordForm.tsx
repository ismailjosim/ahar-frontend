"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Loader2, CircleCheck } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type FormInput = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [sentTo, setSentTo] = useState("")
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit = async ({ email }: FormInput) => {
    setServerError("")
    setLoading(true)
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      })
      if (error) {
        setServerError(error.message ?? "Something went wrong. Please try again.")
        return
      }
      setSentTo(email)
      setSent(true)
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
          <CircleCheck className="size-7 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a reset link to <span className="font-medium text-foreground">{sentTo}</span>. It expires in 1 hour.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={() => {
              setSent(false)
              form.reset()
            }}
            className="text-primary underline underline-offset-2"
          >
            Try again
          </button>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}

      <Field>
        <FieldLabel>Email address</FieldLabel>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            {...form.register("email")}
            type="email"
            placeholder="you@example.com"
            className="pl-9"
            autoComplete="email"
          />
        </div>
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Button disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Send reset link
      </Button>
    </form>
  )
}
