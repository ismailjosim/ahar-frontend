"use client"

import { MenuItem } from "@/types/menu.interface"
import { useCartStore } from "@/store/cart.store"
import { toast } from "sonner"
import MenuCard from "./MenuCard"

interface MenuItemsProps {
  menus: MenuItem[]
}

const MenuItems = ({ menus }: MenuItemsProps) => {
  const addItem = useCartStore((state) => state.addItem)

  const addToCart = (dish: MenuItem, qty: number) => {
    addItem({
      id: dish.id,
      name: dish.name,
      category: dish.category?.name || "Uncategorized",
      imageUrl: dish.imageUrl,
      unitPrice: dish.price,
      quantity: qty,
      addOns: [],
    })
    toast.success(`${dish.name} added to tray!`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {menus.length === 0 ? (
        <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl">
          <p className="text-sm font-bold">No dishes found matching your filters.</p>
        </div>
      ) : (
        menus.map((menu) => <MenuCard key={menu.id} menuItem={menu} addToCart={addToCart} />)
      )}
    </div>
  )
}

export default MenuItems
