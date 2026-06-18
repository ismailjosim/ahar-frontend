import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"
import MenuCatalog from "@/components/modules/Menu/MenuCatalog"

export default function MenuPage() {
  return (
    <main className="page-shell min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <MenuCatalog />
      <PublicFooter />
    </main>
  )
}
