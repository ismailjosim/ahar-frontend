"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import ManagementPageHeader from "@/components/shared/ManagementPageHeader"
import CategoryFormDialog from "./CategoryFormDialog"

const CategoryManagementHeader = () => {
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
        <CategoryFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleSuccess} />
      )}

      <ManagementPageHeader
        title="ক্যাটাগরি ম্যানেজার (Category)"
        description="ক্যাটাগরি যোগ, সম্পাদনা ও অপসারণ করুন"
        action={{
          label: "Add Category",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />
    </>
  )
}

export default CategoryManagementHeader
