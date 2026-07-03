import { Suspense } from "react"

import CategoriesFilter from "@/components/modules/Dashboard/Category/CategoriesFilter"
import CategoriesTable from "@/components/modules/Dashboard/Category/CategoriesTable"

import { getCategories } from "@/services/category/categoriesManagement"
import { queryStringFormatter } from "@/lib/formatters.ts"

import RefreshButton from "@/components/shared/RefreshButton"

import CategoryManagementHeader from "@/components/modules/Dashboard/Category/CategoryManagementHeader"
import TableSkeleton from "@/components/shared/TableSkeleton"
import TablePagination from "@/components/shared/TablePagination"

const CategoryManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const searchParamsObj = await searchParams

  const queryString = queryStringFormatter(searchParamsObj)

  const categoriesResult = await getCategories(queryString)

  const categories = categoriesResult?.data ?? []
  const totalPages = Math.ceil(categoriesResult?.meta?.total / categoriesResult?.meta?.limit)

  return (
    <div className="space-y-6">
      <CategoryManagementHeader />
      <CategoriesFilter categories={categories?.data || []} />
      <Suspense fallback={<TableSkeleton cols={2} rows={10} />}>
        <CategoriesTable categories={categories} />

        <TablePagination currentPage={categories?.meta?.page} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}

export default CategoryManagementPage
