"use client"

import { useState } from "react"
import { Loader2, Save, User, Phone, Mail, CalendarDays } from "lucide-react"

import { authClient } from "@/lib/auth-client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Separator } from "@/components/ui/separator"

import ProfileAvatar from "./ProfileAvatar"
import ImageUploader from "./ImageUploader"

type Session = (typeof authClient.$Infer)["Session"]
type ProfileUser = Session["user"]

interface ProfileEditorProps {
  user: ProfileUser
  refetch: () => Promise<void>
}

export default function ProfileEditor({ user, refetch }: ProfileEditorProps) {
  const [name, setName] = useState(user.name ?? "")
  const [phone, setPhone] = useState(user.phone ?? "")
  const [image, setImage] = useState(user.image ?? "")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await authClient.updateUser({
        name,
        phone,
        image,
      })

      if (error) {
        console.log({ error })
        // setError(error.message)
        return
      }

      await refetch()

      setSuccess("Profile updated successfully.")
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>

        <p className="mt-1 text-muted-foreground">Manage your personal information.</p>
      </div>

      {/* Avatar */}

      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>

          <CardDescription>Upload a profile picture.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <ProfileAvatar image={image} name={name} editable />

          <ImageUploader value={image} onChange={setImage} />
        </CardContent>
      </Card>

      {/* Account Information */}

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>

          <CardDescription>Update your profile details.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input value={user.email} disabled className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input disabled value={new Date(user.createdAt).toLocaleDateString()} className="pl-10" />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
