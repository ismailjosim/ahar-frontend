import { proxyData, proxyMutation } from "@/lib/backend-api"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyData(`/payments/${id}`)
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyMutation(`/payments/${id}`, req, "PATCH")
}
