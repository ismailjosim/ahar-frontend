import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import SignupForm from "./SignupForm"
import LottiePanel from "./LottiePanel"

export default function SignupPage() {
  return (
    <main className="flex min-h-screen bg-canvas text-foreground">
      {/* Left — Lottie illustration panel */}
      <LottiePanel />

      {/* Right — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl border border-accent bg-primary">
              <span className="font-bengali text-lg font-bold text-accent">আ</span>
            </div>
            <span className="text-xl font-semibold">Ahar Bengal</span>
          </div>

          <Card className="w-full">
            <CardHeader>
              <div className="mb-2">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="mt-1 text-sm text-muted-foreground">Join Ahar and manage your restaurant workspace.</p>
              </div>
            </CardHeader>

            <CardContent>
              <SignupForm />
            </CardContent>

            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
