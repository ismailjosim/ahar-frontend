"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
// import AdminFormDialog from "./AdminFormDialog"
import ManagementPageHeader from "@/components/shared/ManagementPageHeader"
import MenuFormDialog from "./MenuFormDialog"

const MenuManagementHeader = () => {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
    setIsDialogOpen(false) // Close the dialog after a successful operation
  }

  return (
    <>
      {/* By conditionally rendering the dialog, React automatically destroys (unmounts)
        the component and resets its internal form state whenever `isDialogOpen` is false.
        This completely eliminates the need for a manual `dialogKey` state.
      */}
      {isDialogOpen && (
        <MenuFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSuccess={handleSuccess} />
      )}

      <ManagementPageHeader
        title="মেনু ম্যানেজার (Menu)"
        description="মেনু আইটেম যোগ, সম্পাদনা ও অপসারণ করুন"
        action={{
          label: "Add Menu",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />
    </>
  )
}

export default MenuManagementHeader
