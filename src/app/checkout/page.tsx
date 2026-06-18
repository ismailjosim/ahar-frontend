import CheckoutPageContent from "@/components/modules/Checkout/CheckoutPageContent"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function CheckoutPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <CheckoutPageContent />
      <PublicFooter />
    </main>
  )
}
