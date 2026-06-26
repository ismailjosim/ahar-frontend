import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ForgotPasswordForm from "./ForgotPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-foreground">
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl border border-accent bg-primary shadow-lg shadow-primary/20">
                <span className="font-bengali text-2xl font-bold text-accent">আ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Forgot your password?</h1>
                <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
