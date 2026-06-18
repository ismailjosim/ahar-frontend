import { NextResponse } from "next/server"
import { getInventoryItem, updateStock } from "@/lib/inventory.store"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const it = getInventoryItem(params.id)
  if (!it) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(it)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    if (typeof body.stock !== "number") return NextResponse.json({ error: "Missing stock" }, { status: 400 })
    const updated = updateStock(params.id, body.stock)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
