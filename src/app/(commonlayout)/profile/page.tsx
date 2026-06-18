"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { ImageIcon, Loader2, Phone, Save, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type AuthSession = (typeof authClient.$Infer)["Session"]
type ProfileUser = AuthSession["user"]

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession()
  const user = session?.user

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <Button asChild>
          <Link href="/auth/login?callbackURL=/profile">Sign in to manage profile</Link>
        </Button>
      </main>
    )
  }

  return <ProfileEditor key={`${user.id}-${user.updatedAt}`} user={user} refetch={refetch} />
}

function ProfileEditor({ user, refetch }: { user: ProfileUser; refetch: () => Promise<void> }) {
  const [name, setName] = useState(user.name || "")
  const [image, setImage] = useState(user.image || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    setIsSaving(true)

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim() || null,
      })

      if (updateError) {
        setError(updateError.message || "Unable to update your profile.")
        return
      }

      await refetch()
      setSuccess("Profile updated successfully.")
    } catch {
      setError("Something went wrong while updating your profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="bg-canvas px-4 py-10 text-foreground">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
          <div
            className="mx-auto flex size-32 items-center justify-center rounded-full border border-border bg-muted bg-cover bg-center text-primary"
            style={image.trim() ? { backgroundImage: `url("${image.trim()}")` } : undefined}
            aria-label="Profile image preview"
          >
            {!image.trim() && <UserRound className="size-14" aria-hidden="true" />}
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-xl font-bold">{user?.name || "Your profile"}</h1>
            <p className="mt-1 break-all text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <Button asChild variant="outline" className="mt-6 h-10 w-full">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </aside>

        <section className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-6">
            <h2 className="font-bengali text-2xl font-bold">Profile settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update your display name, phone and profile image URL.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">
              <span>Name</span>
              <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Your name"
                  required
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Phone</span>
              <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Image URL</span>
              <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="url"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  autoComplete="url"
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="https://example.com/avatar.jpg"
                />
              </span>
            </label>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
                {success}
              </div>
            )}

            <Button type="submit" className="h-10" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" />}
              Save changes
            </Button>
          </form>
        </section>
      </section>
    </main>
  )
}
