import FeaturedDishesSection from "@/components/modules/Home/FeaturedDishesSection"
import HeroSection from "@/components/modules/Home/HeroSection"
import ManagementPreviewSection from "@/components/modules/Home/ManagementPreviewSection"
import OrderJourneySection from "@/components/modules/Home/OrderJourneySection"
import ReviewsSection from "@/components/modules/Home/ReviewsSection"
import SpecialComboSection from "@/components/modules/Home/SpecialComboSection"
import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <HeroSection />
      <FeaturedDishesSection />
      <SpecialComboSection />
      <OrderJourneySection />
      <ReviewsSection />
      <ManagementPreviewSection />
      <PublicFooter />
    </main>
  )
}
