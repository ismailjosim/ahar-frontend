"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Mail, Phone, User, Lock } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { normalizeBDPhone, validateBDPhone } from "@/lib/phone.utils"

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })

type SignupInput = z.infer<typeof schema>

const fieldConfig: {
  name: keyof SignupInput
  label: string
  placeholder: string
  type: string
  icon: React.ReactNode
  isPassword?: boolean
}[] = [
  {
    name: "name",
    label: "Full name",
    placeholder: "Your full name",
    type: "text",
    icon: <User className="size-4" />,
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    icon: <Mail className="size-4" />,
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "+880 1XXX-XXXXXX",
    type: "text",
    icon: <Phone className="size-4" />,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "At least 8 characters",
    type: "password",
    icon: <Lock className="size-4" />,
    isPassword: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    placeholder: "Re-enter your password",
    type: "password",
    icon: <Lock className="size-4" />,
    isPassword: true,
  },
]

export default function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackURL = params.get("callbackURL") ?? "/dashboard"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const form = useForm<SignupInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  })

  const onSubmit: SubmitHandler<SignupInput> = async (values) => {
    setServerError("")
    if (values.phone && !validateBDPhone(values.phone)) {
      setServerError("Enter a valid Bangladeshi phone number")
      return
    }
    setLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone ? normalizeBDPhone(values.phone) : undefined,
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

  const getInputType = (field: (typeof fieldConfig)[number]) => {
    if (!field.isPassword) return field.type
    if (field.name === "password") return showPassword ? "text" : "password"
    return showConfirmPassword ? "text" : "password"
  }

  const toggleVisibility = (fieldName: keyof SignupInput) => {
    if (fieldName === "password") setShowPassword((v) => !v)
    if (fieldName === "confirmPassword") setShowConfirmPassword((v) => !v)
  }

  const isVisible = (fieldName: keyof SignupInput) => (fieldName === "password" ? showPassword : showConfirmPassword)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}

      {fieldConfig.map((field) => (
        <Field key={field.name}>
          <FieldLabel>
            {field.label}
            {field.name === "phone" && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
          </FieldLabel>

          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground" aria-hidden="true">
              {field.icon}
            </span>

            <Input
              placeholder={field.placeholder}
              {...form.register(field.name)}
              type={getInputType(field)}
              className="pl-9 pr-10"
            />

            {field.isPassword && (
              <button
                type="button"
                onClick={() => toggleVisibility(field.name)}
                className="absolute right-3 text-muted-foreground hover:text-foreground"
                aria-label={isVisible(field.name) ? "Hide password" : "Show password"}
              >
                {isVisible(field.name) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
          </div>

          <FieldError errors={[form.formState.errors[field.name]]} />
        </Field>
      ))}

      <Button disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Create account
      </Button>
    </form>
  )
}
