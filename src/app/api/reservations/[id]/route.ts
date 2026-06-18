import { NextResponse } from "next/server"
import { getReservationById, updateReservation, deleteReservation } from "@/lib/reservations.store"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  const resv = getReservationById(id)
  if (!resv) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(resv)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = updateReservation(id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id } = await params
  const ok = deleteReservation(id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
