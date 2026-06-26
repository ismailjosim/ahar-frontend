import { Suspense } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import MenuManagementHeader from "@/components/modules/Dashboard/Menu/MenuManagementHeader"
import MenusFilter from "@/components/modules/Dashboard/Menu/MenusFilter"
import MenusTable from "@/components/modules/Dashboard/Menu/MenusTable"

import { getMenuItems } from "@/services/menu/menusManagement"
import { queryStringFormatter } from "@/lib/formatters.ts"
import RefreshButton from "@/components/shared/RefreshButton"

const MenuManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParamsObj = await searchParams
  const queryString = queryStringFormatter(searchParamsObj)
  const menuResult = await getMenuItems(queryString)
  const menuItems = menuResult?.data ?? []

  return (
    <div className="space-y-6">
      <MenuManagementHeader />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Suspense fallback={<div className="h-9 w-80 animate-pulse rounded-md bg-muted" />}>
          <MenusFilter />
        </Suspense>
        <RefreshButton />
      </div>

      <MenusTable menuItems={menuItems} />
    </div>
  )
}

export default MenuManagementPage
