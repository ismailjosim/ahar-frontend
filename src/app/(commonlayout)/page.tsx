import ExperienceAharSection from "@/components/modules/Home/ExperienceAharSection"
import FeaturedDishesSection from "@/components/modules/Home/FeaturedDishesSection"
import HeroSection from "@/components/modules/Home/HeroSection"
import ManagementPreviewSection from "@/components/modules/Home/ManagementPreviewSection"
import OrderJourneySection from "@/components/modules/Home/OrderJourneySection"
import ReviewsSection from "@/components/modules/Home/ReviewsSection"
import SpecialComboSection from "@/components/modules/Home/SpecialComboSection"

export default function HomePage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturedDishesSection />
      <SpecialComboSection />
      <ExperienceAharSection />
      <OrderJourneySection />
      <ReviewsSection />
      <ManagementPreviewSection />
    </main>
  )
}
