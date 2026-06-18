import { proxyData, proxyDelete, proxyMutation } from "@/lib/backend-api"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyData(`/inventory/${id}`)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyMutation(`/inventory/${id}`, req, "PATCH")
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyDelete(`/inventory/${id}`)
}
