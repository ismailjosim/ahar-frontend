import { NextResponse } from "next/server"
import { getMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu.store"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const item = getMenuItem(params.id)
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updated = updateMenuItem(params.id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const ok = deleteMenuItem(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
