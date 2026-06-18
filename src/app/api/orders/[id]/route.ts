import { NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders.mock"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  const order = getOrderById(id)
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
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
