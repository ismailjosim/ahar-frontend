import { NextResponse } from "next/server"
import { listMenu, createMenuItem } from "@/lib/menu.store"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10)
  const category = url.searchParams.get("category") || undefined
  const search = url.searchParams.get("search") || undefined

  const result = listMenu({ page, pageSize, category, search })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = createMenuItem(body)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
