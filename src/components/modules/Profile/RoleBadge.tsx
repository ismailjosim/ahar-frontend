"use client"

import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserRound, ChefHat, Briefcase } from "lucide-react"

// 1. Define a strict type for your valid roles
type AllowedRole = "admin" | "manager" | "chef" | "customer"

interface RoleBadgeProps {
  role?: string | null
}

// 2. Type the config object using Record with your AllowedRole
const roleConfig: Record<
  AllowedRole,
  {
    label: string
    icon: React.ElementType
    className: string
  }
> = {
  admin: {
    label: "Administrator",
    icon: ShieldCheck,
    className: "border-primary/20 bg-primary-soft text-primary hover:bg-primary-soft",
  },
  manager: {
    label: "Manager",
    icon: Briefcase,
    className: "border-warning/30 bg-warning-soft text-warning-foreground hover:bg-warning-soft",
  },
  chef: {
    label: "Chef",
    icon: ChefHat,
    className: "border-accent/30 bg-accent/10 text-accent hover:bg-accent/10",
  },
  customer: {
    label: "Customer",
    icon: UserRound,
    className: "border-success/20 bg-success-soft text-success hover:bg-success-soft",
  },
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  // 3. Normalize the string and safely check if it's a valid key
  const normalizedRole = role?.toLowerCase() ?? ""

  // 4. Type guard/fallback mechanism
  const isKnownRole = normalizedRole in roleConfig

  const config = isKnownRole
    ? roleConfig[normalizedRole as AllowedRole]
    : {
        label: role ?? "User",
        icon: UserRound,
        className: "border-border bg-muted text-muted-foreground hover:bg-muted",
      }

  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  )
}
