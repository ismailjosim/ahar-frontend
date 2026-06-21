import { Suspense } from "react"

import OrderTrackingPageContent from "@/components/modules/OrderTracking/OrderTrackingPageContent"

export default function OrderTrackingPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <OrderTrackingPageContent />
      </Suspense>
    </main>
  )
}
