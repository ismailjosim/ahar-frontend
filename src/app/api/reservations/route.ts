import { NextResponse } from "next/server"
import { listReservations, createReservation } from "@/lib/reservations.store"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10)
  const status = url.searchParams.get("status") || undefined
  const search = url.searchParams.get("search") || undefined

  const result = listReservations({ page, pageSize, status: status || undefined, search: search || undefined })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = createReservation(body)
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
