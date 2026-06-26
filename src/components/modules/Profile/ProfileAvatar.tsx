"use client"

import Image from "next/image"
import { Camera, User2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  image?: string | null
  name?: string | null

  size?: "sm" | "md" | "lg" | "xl"

  editable?: boolean

  className?: string

  onEditClick?: () => void
}

const avatarSizes = {
  sm: {
    avatar: "h-14 w-14",
    icon: "h-3.5 w-3.5",
    camera: "h-7 w-7",
  },

  md: {
    avatar: "h-20 w-20",
    icon: "h-5 w-5",
    camera: "h-8 w-8",
  },

  lg: {
    avatar: "h-28 w-28",
    icon: "h-7 w-7",
    camera: "h-10 w-10",
  },

  xl: {
    avatar: "h-36 w-36",
    icon: "h-8 w-8",
    camera: "h-11 w-11",
  },
}

export default function ProfileAvatar({
  image,
  name,
  size = "lg",
  editable = false,
  className,
  onEditClick,
}: ProfileAvatarProps) {
  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  const styles = avatarSizes[size]

  return (
    <div className={cn("relative w-fit", className)}>
      <Avatar className={cn(styles.avatar, "border-4 border-primary/15 shadow-lg")}>
        {image && (
          <AvatarImage asChild src={image}>
            <Image src={image} alt={name ?? "Profile"} fill className="object-cover" sizes="144px" />
          </AvatarImage>
        )}

        <AvatarFallback className="bg-primary-soft text-primary font-bold">
          {image ? null : initials || <User2 className={styles.icon} />}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <button
          type="button"
          onClick={onEditClick}
          className="
            absolute
            bottom-1
            right-1
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-primary
            text-primary-foreground
            shadow-md
            transition-all
            hover:scale-105
            hover:bg-primary-hover
            active:scale-95
          "
        >
          <Camera className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
