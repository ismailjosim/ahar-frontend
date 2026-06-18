import { NextResponse } from "next/server"
import { deleteInventoryItem, getInventoryItem, updateInventoryItem, updateStock } from "@/lib/inventory.store"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  const it = getInventoryItem(id)
  if (!it) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(it)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated =
      typeof body.stock === "number" && Object.keys(body).length === 1
        ? updateStock(id, body.stock)
        : updateInventoryItem(id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id } = await params
  const ok = deleteInventoryItem(id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
