import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ResetPasswordForm from "./ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl border border-accent bg-primary shadow-lg shadow-primary/20">
                <span className="font-bengali text-2xl font-bold text-accent">আ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Choose a new password</h1>
                <p className="text-sm text-muted-foreground">Make it strong — at least 8 characters.</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Suspense needed because ResetPasswordForm reads searchParams */}
            <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
