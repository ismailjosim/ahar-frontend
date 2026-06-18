import HeroSection from "@/components/modules/Home/HeroSection"
import ManagementPreviewSection from "@/components/modules/Home/ManagementPreviewSection"
import OrderJourneySection from "@/components/modules/Home/OrderJourneySection"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <HeroSection />
      <OrderJourneySection />
      <ManagementPreviewSection />
      <PublicFooter />
    </main>
  )
}
