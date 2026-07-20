import { Suspense } from "react"

// Layout & Modular Components
import MenuHeader from "@/components/modules/Menu/MenuHeader"
import MenuFilterOptions from "@/components/modules/Menu/MenuFilterOptions"
import MenuFilterWrapper from "@/components/modules/Menu/MenuFilterWrapper"
import MenusWrapper from "@/components/modules/Menu/MenusWrapper"

// Shared Components & Loaders

// Core Business Logic & Data Formatters
import { queryStringFormatter } from "@/lib/formatters.ts"
import { getCategories } from "@/services/category/categoriesManagement"
import { getMenuItems } from "@/services/menu/menusManagement"
import MenuSkeleton from "@/components/modules/Menu/MenuSkeleton"
import MenuCardPagination from "@/components/modules/Menu/MenuCardPagination"

// --- 1. DYNAMIC ASYNC STREAMED CONTENT BLOCK ---
interface MenuGridSectionProps {
  queryString: string
}

const MenuGridSection = async ({ queryString }: MenuGridSectionProps) => {
  // Asynchronously stream menu results matching the serialized query string
  const menuResult = await getMenuItems(queryString)
  const menus = menuResult?.data ?? []

  // Calculate exact pagination metrics safely
  const totalPages = Math.ceil((menuResult?.meta?.total || 0) / (menuResult?.meta?.limit || 1))
  const currentPage = menuResult?.meta?.page || 1

  return (
    <div className="space-y-6 w-full animate-in fade-in-40 duration-300">
      {/* Renders the filtered and processed grid arrays */}
      <MenusWrapper menus={menus} />

      {/* Bottom active page pagination navigation */}
      <MenuCardPagination currentPage={currentPage} totalPages={totalPages || 1} />
    </div>
  )
}

// --- 2. MASTER SERVER ROUTE PAGE COMPONENT ---
interface MenuPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const MenuPage = async ({ searchParams }: MenuPageProps) => {
  // Resolve Next.js search parameters securely from execution context
  const searchParamsObj = await searchParams
  const queryString = queryStringFormatter(searchParamsObj)

  // Fetch high-level categories directly on the page to prevent filter shell flickering
  const categoriesResult = await getCategories()
  const categories = categoriesResult?.data ?? []

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Dynamic Marketing & Branding Header Component */}
        <MenuHeader />

        {/* Primary Page Content Split Frame Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          {/* Static Sidebar Filtering Options Panels */}
          <MenuFilterOptions />

          {/* Main Context Action Canvas */}
          <div className="grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-6">
            {/* Horizontal Filter Navigation and Category Image/Icon Bubble Row */}
            <MenuFilterWrapper categories={categories} />

            {/* 
              The unique queryString key applied down to the Suspense boundary 
              guarantees the 9-card MenuPagination skeleton instantly re-triggers 
              whenever pagination values or custom sidebar parameters alter state.
            */}
            <Suspense key={queryString} fallback={<MenuSkeleton />}>
              <MenuGridSection queryString={queryString} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MenuPage
