import { Suspense } from "react"

import CategoriesFilter from "@/components/modules/Dashboard/Category/CategoriesFilter"
import CategoriesTable from "@/components/modules/Dashboard/Category/CategoriesTable"

import { getCategories } from "@/services/category/categoriesManagement"
import { queryStringFormatter } from "@/lib/formatters.ts"

import RefreshButton from "@/components/shared/RefreshButton"

import CategoryManagementHeader from "@/components/modules/Dashboard/Category/CategoryManagementHeader"

const CategoryManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const searchParamsObj = await searchParams

  const queryString =
    queryStringFormatter(searchParamsObj)

  const categoriesResult =
    await getCategories(queryString)

  const categories =
    categoriesResult?.data ?? []

  return (
    <div className="space-y-6">
      <CategoryManagementHeader />

      <div className="flex items-center justify-between gap-3">
        <Suspense
          fallback={
            <div className="h-9 w-80 animate-pulse rounded-md bg-muted" />
          }
        >
          <CategoriesFilter />
          <RefreshButton />
        </Suspense>

      </div>

      <CategoriesTable
        categories={categories}
      />
    </div>
  )
}

export default CategoryManagementPage