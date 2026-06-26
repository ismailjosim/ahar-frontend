"use client"

import { ImagePlus, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
interface ImageUploaderProps {
  value: string
  onChange: (value: string) => void
}

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  return (
    <Card className="border-dashed border-2 border-border bg-muted/30">
      <div className="flex flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
          <ImagePlus className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload Profile Photo</h3>

          <p className="max-w-sm text-sm text-muted-foreground">
            Choose a JPG, PNG, or WEBP image. Maximum file size will be 5 MB.
          </p>
        </div>

        <Button type="button">
          <UploadCloud className="mr-2 h-4 w-4" />
          Choose Image
        </Button>

        <p className="text-xs text-muted-foreground">Drag &amp; drop support will be available soon.</p>
      </div>
    </Card>
  )
}

export default ImageUploader
