import MenuManagementHeader from "@/components/modules/Dashboard/Menu/MenuManagementHeader"
import MenuManagerContent from "@/components/modules/Dashboard/MenuManagerContent"
import { queryStringFormatter } from "@/lib/formatters.ts"

const MenuManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParamsObj = await searchParams
  const queryString = queryStringFormatter(searchParamsObj)
  // const menuResult = await getAllMenuItems(queryString)
  // const totalPages = Math.ceil((menuResult?.meta?.total || 1) / (menuResult?.meta?.limit || 1))
  return (
    <div className="space-y-6">
      <MenuManagementHeader />
      <MenuManagerContent />
    </div>
  )
}

export default MenuManagementPage
