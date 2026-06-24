"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

function CancelPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <AlertCircle className="mx-auto size-16 text-warning" />
      <h1 className="font-bengali mt-4 text-3xl font-black tracking-tight sm:text-4xl text-warning">
        পেমেন্ট বাতিল করা হয়েছে
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You have cancelled the payment session. The transaction has been aborted.
      </p>

      {orderId && (
        <div className="mt-4 text-xs font-semibold text-muted-foreground">
          Order ID: <span className="font-black text-foreground">{orderId}</span>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="rounded-full px-8 py-5 font-bold shadow-md">
          <Link href={orderId ? `/order-tracking?id=${orderId}` : "/menu"}>View Unpaid Order</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-8 py-5 font-bold">
          <Link href="/menu">Back to Menu</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={null}>
      <CancelPageContent />
    </Suspense>
  )
}
