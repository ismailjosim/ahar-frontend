import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import ProfileShell from "@/components/modules/Profile/ProfileShell"

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <ProfileShell
      user={session.user}
      refetch={async () => {
        "use server"
      }}
    />
  )
}
