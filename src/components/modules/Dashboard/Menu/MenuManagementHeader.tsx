"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import ManagementPageHeader from "@/components/shared/ManagementPageHeader"
import MenuFormDialog from "./MenuFormDialog"
import type { Category } from "@/types/category.interface"

interface MenuManagementHeaderProps {
  categories: Category[]
}

const MenuManagementHeader = ({ categories }: MenuManagementHeaderProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
    setIsDialogOpen(false)
  }

  return (
    <>
      {isDialogOpen && (
        <MenuFormDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSuccess}
          categories={categories}
        />
      )}

      <ManagementPageHeader
        title="খাবার তালিকা (Menu Items)"
        description="মেনু আইটেম যোগ, সম্পাদনা ও অপসারণ করুন"
        action={{
          label: "Add Menu Item",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />
    </>
  )
}

export default MenuManagementHeader
