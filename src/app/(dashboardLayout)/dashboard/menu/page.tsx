import { Suspense } from "react"

import MenuManagementHeader from "@/components/modules/Dashboard/Menu/MenuManagementHeader"
import MenusFilter from "@/components/modules/Dashboard/Menu/MenusFilter"
import MenusTable from "@/components/modules/Dashboard/Menu/MenusTable"

import { getMenuItems } from "@/services/menu/menusManagement"
import { getCategories } from "@/services/category/categoriesManagement"
import { queryStringFormatter } from "@/lib/formatters.ts"
import TableSkeleton from "@/components/shared/TableSkeleton"
import TablePagination from "@/components/shared/TablePagination"

const MenuManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const searchParamsObj = await searchParams
  const queryString = queryStringFormatter(searchParamsObj)
  const menuResult = await getMenuItems(queryString)
  const menuItems = menuResult?.data ?? []
  const totalPages = Math.ceil(menuResult?.meta?.total / menuResult?.meta?.limit)

  const categoriesResult = await getCategories()
  const categories = categoriesResult?.data ?? []

  return (
    <div className="space-y-6">
      <MenuManagementHeader categories={categories} />
      <MenusFilter categories={categories} />
      <Suspense fallback={<TableSkeleton cols={10} rows={10} />}>
        <MenusTable menuItems={menuItems} categories={categories} />
        <TablePagination currentPage={menuResult?.meta?.page || 1} totalPages={totalPages || 1} />
      </Suspense>
    </div>
  )
}

export default MenuManagementPage
