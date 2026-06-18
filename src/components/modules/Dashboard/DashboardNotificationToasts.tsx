"use client"

import { useEffect, useState } from "react"

interface DashboardToast {
  id: string
  message: string
  type: "success" | "warning" | "info"
}

export function notifyDashboard(message: string, type: DashboardToast["type"] = "info") {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("ahar:notify", { detail: { message, type } }))
}

export default function DashboardNotificationToasts() {
  const [toasts, setToasts] = useState<DashboardToast[]>([])

  useEffect(() => {
    function handleNotify(event: Event) {
      const detail = (event as CustomEvent<{ message: string; type?: DashboardToast["type"] }>).detail
      const id = Date.now().toString()
      setToasts((current) => [
        {
          id,
          message: detail.message,
          type: detail.type || "info",
        },
        ...current.slice(0, 2),
      ])
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 4200)
    }

    window.addEventListener("ahar:notify", handleNotify)
    return () => window.removeEventListener("ahar:notify", handleNotify)
  }, [])

  return (
    <div className="fixed right-4 top-24 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border p-4 text-sm font-semibold shadow-xl backdrop-blur ${
            toast.type === "success"
              ? "border-success/30 bg-success-soft text-success-foreground"
              : toast.type === "warning"
                ? "border-warning/30 bg-warning-soft text-warning-foreground"
                : "border-border bg-card text-card-foreground"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
