"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, ShoppingBag, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/cart.utils"
import { cn } from "@/lib/utils"

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setError("No order ID was found in the URL.")
      setLoading(false)
      return
    }

    let intervalId: any
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          setError("Failed to fetch order details.")
          return
        }
        const data = await res.json()
        setOrder(data)
        // If the payment is completed or failed, we can stop polling
        if (data.paymentStatus === "Completed" || data.paymentStatus === "Failed") {
          clearInterval(intervalId)
        }
      } catch {
        setError("An error occurred while loading order status.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    // Poll every 3 seconds to wait for SSLCOMMERZ IPN to arrive and update status
    intervalId = setInterval(fetchOrder, 3000)

    return () => clearInterval(intervalId)
  }, [orderId])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground">Checking payment status...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <XCircle className="mx-auto size-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-black">Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error || "Something went wrong."}</p>
        <Button asChild className="mt-6 rounded-full px-6">
          <Link href="/menu">Return to Menu</Link>
        </Button>
      </div>
    )
  }

  const isCompleted = order.paymentStatus === "Completed"

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="motion-reveal flex flex-col items-center text-center">
        {isCompleted ? (
          <CheckCircle2 className="size-16 text-success animate-bounce animate-duration-1000" />
        ) : (
          <Loader2 className="size-16 animate-spin text-warning" />
        )}

        <h1 className="font-bengali mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          {isCompleted ? "পেমেন্ট সফল হয়েছে!" : "পেমেন্ট প্রসেসিং হচ্ছে..."}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isCompleted
            ? "Thank you for your payment. Your order has been placed and is being prepared."
            : "We are waiting for validation from the payment gateway. This will update automatically."}
        </p>

        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-border pb-3 text-sm font-black uppercase tracking-wider">
            <ShoppingBag className="size-4 text-primary" />
            Order Details
          </h2>
          <div className="mt-4 space-y-3 text-xs font-semibold text-muted-foreground">
            <div className="flex justify-between border-b border-border pb-2">
              <span>Order ID</span>
              <span className="font-black text-foreground">{order.id}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span>Amount Paid</span>
              <span className="font-black text-primary text-base">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span>Payment Method</span>
              <span className="font-black text-foreground uppercase">{order.method}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Payment Status</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider",
                  isCompleted ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
                )}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
          <Button asChild className="rounded-full px-8 py-5 font-bold shadow-md">
            <Link href={`/order-tracking?id=${order.id}`}>Track Order Progress</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8 py-5 font-bold">
            <Link href="/menu">Back to Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground">Loading checkout status...</p>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
