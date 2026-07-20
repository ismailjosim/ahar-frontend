"use client"
import { Category } from "@/types/category.interface"
import MenuCategoriesFilterBubble from "./MenuCategoriesFilterBubble"
import MenuSearchFilterOption from "./MenuSearchFilterOption"
import { useState } from "react"

const MenuFilterWrapper = ({ categories }: { categories: Category[] }) => {
  // 2. State Management
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="w-full flex flex-col gap-6">
      <MenuSearchFilterOption searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MenuCategoriesFilterBubble
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  )
}
export default MenuFilterWrapper
