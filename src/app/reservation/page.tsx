import ReservationPageContent from "@/components/modules/Reservation/ReservationPageContent"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function ReservationPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <ReservationPageContent />
      <PublicFooter />
    </main>
  )
}
