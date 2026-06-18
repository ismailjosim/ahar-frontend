import { NextResponse } from "next/server"
import { createInventoryItem, listInventory } from "@/lib/inventory.store"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(url.searchParams.get("pageSize") || "100", 10)

  const result = listInventory({ page, pageSize })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    return NextResponse.json(createInventoryItem(body), { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
