import { MenuItem } from "@/types/menu.interface"
import MenuItems from "./MenuItems"

interface MenusWrapperProps {
  menus: MenuItem[]
}

const MenusWrapper = ({ menus }: MenusWrapperProps) => {
  return (
    <section>
      {/* section: Menu heading */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
          All Delicacies
          {/* {selectedCategory === "all" ? "All Delicacies" : CATEGORIES.find((c) => c.id === selectedCategory)?.label} */}
        </h3>
        <span className="text-xs text-muted-foreground">{menus.length} Items</span>
      </div>
      {/* section: menu grid */}
      <MenuItems menus={menus} />
    </section>
  )
}

export default MenusWrapper
