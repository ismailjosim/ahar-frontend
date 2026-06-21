"use client"

import { useEffect } from "react"

import PublicFooter from "@/components/shared/PublicFooter"
import PublicNavbar from "@/components/shared/PublicNavbar"
import { useCartStore } from "@/store/cart.store"

export default function CommonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Rehydrate the cart from localStorage after the first client render.
  // skipHydration is set on the store, so this is the only place rehydration happens.
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  )
}
