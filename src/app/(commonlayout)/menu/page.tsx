import MenuCatalog from "@/components/modules/Menu/MenuCatalog"
import MenuHeader from "@/components/modules/Menu/MenuHeader"

export default function MenuPage() {
  return (
    <main className="page-shell bg-background text-foreground py-8">
      <MenuHeader />
      <MenuCatalog />
    </main>
  )
}
