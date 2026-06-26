import Link from "next/link"
import { ArrowLeft, UtensilsCrossed, ChartBar, Users, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SignupForm from "./SignupForm"

const features = [
  {
    icon: UtensilsCrossed,
    title: "Menu management",
    description: "Create and organise your full menu with categories, pricing, and availability.",
  },
  {
    icon: ChartBar,
    title: "Sales analytics",
    description: "Track revenue, top dishes, and daily performance from one dashboard.",
  },
  {
    icon: Users,
    title: "Team access",
    description: "Add staff with role-based access so everyone sees only what they need.",
  },
  {
    icon: Star,
    title: "Customer insights",
    description: "Understand your regulars and grow loyalty with data-driven decisions.",
  },
]

export default function SignupPage() {
  return (
    <main className="flex min-h-screen bg-canvas text-foreground">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 size-80 rounded-full bg-white/5" />
          <div className="absolute bottom-10 right-10 size-64 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="font-bengali text-lg font-bold text-white">আ</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Ahar Bengal</span>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Run your restaurant
              <br />
              <span className="text-white/60">with clarity.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-white/50">
              Everything your team needs — menus, orders, analytics — in one focused workspace.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10">
                  <Icon className="size-4 text-white/80" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/45">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <p className="text-sm italic text-white/30">
            &ldquo;Built for Bangladeshi restaurant owners who mean business.&rdquo;
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo (shown only on small screens) */}
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

            <CardFooter className="flex flex-col gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to home
                </Link>
              </Button>
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
