import MenuCatalog from "@/components/modules/Menu/MenuCatalog"
import MenuFilterOptions from "@/components/modules/Menu/MenuFilterOptions"
import MenuFilterWrapper from "@/components/modules/Menu/MenuFilterWrapper"
import MenuHeader from "@/components/modules/Menu/MenuHeader"
import { queryStringFormatter } from "@/lib/formatters.ts"
import { getCategories } from "@/services/category/categoriesManagement"

const MenuPage = async ({
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
    <main className="page-shell bg-background text-foreground py-8">
      <MenuHeader />
      {/* TODO: Filter data from the category menu and store in session storage */}
      <div className="container mx-auto py-6 flex flex-col lg:flex-row gap-6 w-full items-start">
        {/* LEFT SIDEBAR: FILTERS */}
        <MenuFilterOptions />
        {/* RIGHT CONTENT CONTAINER */}
        <div className="grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-6">
          {/* right side filter search + category bubble */}
          <MenuFilterWrapper categories={categories} />
          {/* Menu Grid[cite: 1] */}
        </div>
      </div>
      <MenuCatalog />
    </main>
  )
}

export default MenuPage
