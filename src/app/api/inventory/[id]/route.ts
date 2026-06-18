import { NextResponse } from "next/server"
import { getInventoryItem, updateStock } from "@/lib/inventory.store"

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
    if (typeof body.stock !== "number") return NextResponse.json({ error: "Missing stock" }, { status: 400 })
    const updated = updateStock(id, body.stock)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
