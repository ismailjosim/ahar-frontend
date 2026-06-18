import OrderTrackingPageContent from "@/components/modules/OrderTracking/OrderTrackingPageContent"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function OrderTrackingPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <OrderTrackingPageContent />
      <PublicFooter />
    </main>
  )
}
