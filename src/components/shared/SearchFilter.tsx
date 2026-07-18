"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Input } from "../ui/input"
import { useDebounce } from "../hooks/useDebounce"

interface SearchFilterProps {
  placeholder?: string
  paramName?: string
}

const SearchFilter = ({ placeholder = "Search...", paramName = "searchTerm" }: SearchFilterProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get(paramName) || "")
  const debouncedValue = useDebounce(value, 500)
  const isExternalUpdate = useRef(false)

  // URL theke param external-vabe (Clear button) remove hole local state sync koro
  useEffect(() => {
    const paramValue = searchParams.get(paramName) || ""
    if (paramValue === "" && value !== "") {
      isExternalUpdate.current = true
      setValue("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, paramName])

  useEffect(() => {
    // Ei change ta jodi external clear theke ashe, tahole URL push skip koro
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    const initialValue = searchParams.get(paramName) || ""

    if (debouncedValue === initialValue) {
      return
    }

    if (debouncedValue) {
      params.set(paramName, debouncedValue)
      params.set("page", "1")
    } else {
      params.delete(paramName)
      params.delete("page")
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  )
}

export default SearchFilter
