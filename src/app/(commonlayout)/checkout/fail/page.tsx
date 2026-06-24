"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

function FailPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <XCircle className="mx-auto size-16 text-destructive animate-pulse" />
      <h1 className="font-bengali mt-4 text-3xl font-black tracking-tight sm:text-4xl text-destructive">
        পেমেন্ট ব্যর্থ হয়েছে
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Unfortunately, your payment transaction could not be completed. Your order has been placed but remains unpaid.
      </p>

      {orderId && (
        <div className="mt-4 text-xs font-semibold text-muted-foreground">
          Order ID: <span className="font-black text-foreground">{orderId}</span>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="rounded-full px-8 py-5 font-bold shadow-md bg-destructive hover:bg-destructive/90">
          <Link href={orderId ? `/order-tracking?id=${orderId}` : "/menu"}>View Unpaid Order</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-8 py-5 font-bold">
          <Link href="/menu">Back to Menu</Link>
        </Button>
      </div>
    </div>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={null}>
      <FailPageContent />
    </Suspense>
  )
}
