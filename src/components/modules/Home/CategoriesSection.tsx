import { Category } from "@/types/category.interface"
import { CategoriesCarousel } from "./categories-carousel"
import { getCategories } from "@/services/category/categoriesManagement"

function extractCategories(
  result: Category[] | { data?: Category[] | null; success?: boolean } | null | undefined,
): Category[] {
  if (!result) return []
  if (Array.isArray(result)) return result
  return result.data ?? []
}

export default async function CategoriesSection() {
  const categoriesResult = await getCategories()
  const categories = extractCategories(categoriesResult).filter((category) => category.status === "ACTIVE")

  if (categories.length === 0) return null

  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Culinary Categories</span>
        <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          আমাদের <span className="text-primary">ক্যাটাগরি সমূহ</span> ঘুরে দেখুন
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Explore our full range of Bengali fine-dining categories, from traditional thali to signature desserts.
        </p>
      </div>

      <div className="mt-12">
        <CategoriesCarousel categories={categories} />
      </div>
    </section>
  )
}
