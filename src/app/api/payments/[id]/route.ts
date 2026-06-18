import { NextResponse } from "next/server"
import { getPayment, updatePaymentStatus } from "@/lib/payments.store"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const p = getPayment(params.id)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(p)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status } = body
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 })
    const updated = updatePaymentStatus(params.id, status)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}
