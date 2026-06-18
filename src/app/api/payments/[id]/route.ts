import { NextResponse } from "next/server"
import { getPayment, updatePaymentStatus } from "@/lib/payments.store"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  const p = getPayment(id)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(p)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  try {
    const body = await req.json()
    const { status } = body
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 })
    const updated = updatePaymentStatus(id, status)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
