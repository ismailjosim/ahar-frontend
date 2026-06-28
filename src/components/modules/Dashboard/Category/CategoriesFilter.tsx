'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'

export default function CategoriesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search =
    searchParams.get('searchTerm') ?? ''

  return (
    <Input
      placeholder='Search categories...'
      defaultValue={search}
      onChange={(e) => {
        const params = new URLSearchParams(
          searchParams.toString()
        )

        if (e.target.value) {
          params.set(
            'searchTerm',
            e.target.value
          )
        } else {
          params.delete('searchTerm')
        }

        router.replace(`?${params}`)
      }}
    />
  )
}