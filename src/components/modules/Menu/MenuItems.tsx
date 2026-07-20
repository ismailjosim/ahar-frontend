"use client"

import { MenuItem } from "@/types/menu.interface"
import MenuCard from "./MenuCard"

interface MenuItemsProps {
  menus: MenuItem[]
}

const MenuItems = ({ menus }: MenuItemsProps) => {
  const addToCart = (dish: MenuItem, qty: number) => {
    console.log(dish, qty)
    return
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
