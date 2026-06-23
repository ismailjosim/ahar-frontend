import MenuManagementHeader from "@/components/modules/Dashboard/Menu/MenuManagementHeader"
import MenuManagerContent from "@/components/modules/Dashboard/MenuManagerContent"

const MenuManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParamsObj = await searchParams
  return (
    <div className="space-y-6">
      <MenuManagementHeader />

      <MenuManagerContent />
    </div>
  )
}

export default MenuManagementPage
