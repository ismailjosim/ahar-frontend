import ExperienceAharSection from "@/components/modules/Home/ExperienceAharSection"
import FeaturedDishesSection from "@/components/modules/Home/FeaturedDishesSection"
import GallerySection from "@/components/modules/Home/GallerySection"
import HeroSection from "@/components/modules/Home/HeroSection"
import LocationHoursSection from "@/components/modules/Home/LocationHoursSection"
import MenuPreviewSection from "@/components/modules/Home/MenuPreviewSection"
import OrderJourneySection from "@/components/modules/Home/OrderJourneySection"
import ReservationCTASection from "@/components/modules/Home/ReservationCTASection"
import ReviewsSection from "@/components/modules/Home/ReviewsSection"
import SpecialComboSection from "@/components/modules/Home/SpecialComboSection"
import CategoriesSection from "@/components/modules/Home/CategoriesSection"

export default function HomePage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturedDishesSection />
      <SpecialComboSection />
      <ExperienceAharSection />
      <MenuPreviewSection />
      <OrderJourneySection />
      <CategoriesSection />
      <ReviewsSection />
      <GallerySection />
      <ReservationCTASection />
      <LocationHoursSection />
    </main>
  )
}
