import { NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders.mock"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const order = getOrderById(id)
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const body = await req.json()
    const { status } = body
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 })
    const updated = updateOrderStatus(id, status)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
