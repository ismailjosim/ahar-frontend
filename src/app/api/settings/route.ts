import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/settings.store"

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    return NextResponse.json(updateSettings(body))
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
