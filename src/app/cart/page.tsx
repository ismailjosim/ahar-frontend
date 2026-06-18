import CartPageContent from "@/components/modules/Cart/CartPageContent"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function CartPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <CartPageContent />
      <PublicFooter />
    </main>
  )
}
