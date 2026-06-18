import { NextResponse } from "next/server"
import { listOrders } from "@/lib/orders.mock"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10)
  const status = url.searchParams.get("status") || undefined
  const search = url.searchParams.get("search") || undefined

  const result = listOrders({ page, pageSize, status: status || undefined, search: search || undefined })
  return NextResponse.json(result)
}
