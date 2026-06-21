"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import CheckoutPageContent from "@/components/modules/Checkout/CheckoutPageContent"
import { useCartStore } from "@/store/cart.store"

export default function CheckoutPage() {
  const router = useRouter()
  const itemCount = useCartStore((s) => s.getItemCount())
  const clearOrderPlaced = useCartStore((s) => s.clearOrderPlaced)
  const [hydrated, setHydrated] = useState(() => useCartStore.persist.hasHydrated())

  useEffect(() => {
    // The initial useState already captured an early hydration; this only
    // catches the hydration that finishes after mount (the common case).
    return useCartStore.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  useEffect(() => {
    if (!hydrated || itemCount > 0) return
    // A freshly placed order empties the cart; consume the flag once and stay
    // put so the success redirect to /order-tracking is not overridden.
    if (useCartStore.getState().justPlacedOrder) {
      clearOrderPlaced()
      return
    }
    router.replace("/menu")
  }, [hydrated, itemCount, router, clearOrderPlaced])

  if (!hydrated || itemCount === 0) return null

  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <CheckoutPageContent />
    </main>
  )
}
