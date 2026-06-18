import { NextResponse } from "next/server"
import { getMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu.store"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  const item = getMenuItem(id)
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = updateMenuItem(id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id } = await params
  const ok = deleteMenuItem(id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
