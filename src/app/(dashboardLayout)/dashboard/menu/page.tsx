import { Suspense } from "react"
import MenuManagementHeader from "@/components/modules/Dashboard/Menu/MenuManagementHeader"
import MenusFilter from "@/components/modules/Dashboard/Menu/MenusFilter"
import MenusTable from "@/components/modules/Dashboard/Menu/MenusTable"

import { getMenuItems } from "@/services/menu/menusManagement"
import { queryStringFormatter } from "@/lib/formatters.ts"
import RefreshButton from "@/components/shared/RefreshButton"
import { getCategories } from "@/services/category/categoriesManagement"
import MenuTable from "../../../../components/modules/Dashboard/Menu/MenusTable"

const MenuManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParamsObj = await searchParams
  const queryString = queryStringFormatter(searchParamsObj)
  const menuResult = await getMenuItems(queryString)
  const menuItems = menuResult?.data ?? []

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <MenuManagementHeader categories={categories?.data || []} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Suspense fallback={<div className="h-9 w-80 animate-pulse rounded-md bg-muted" />}>
          <MenusFilter categories={categories?.data || []} />
        </Suspense>
        <RefreshButton />
      </div>

      <MenuTable menuItems={menuItems} categories={categories?.data || []} />
    </div>
  )
}

export default MenuManagementPage
