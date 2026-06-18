import { NextResponse } from "next/server"
import { listInventory } from "@/lib/inventory.store"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(url.searchParams.get("pageSize") || "100", 10)

  const result = listInventory({ page, pageSize })
  return NextResponse.json(result)
}
