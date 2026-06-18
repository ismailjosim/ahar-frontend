import { NextResponse } from "next/server"
import { getReservationById, updateReservation, deleteReservation } from "@/lib/reservations.store"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const resv = getReservationById(params.id)
  if (!resv) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(resv)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updated = updateReservation(params.id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const ok = deleteReservation(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
