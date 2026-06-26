"use client"

import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />

      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
