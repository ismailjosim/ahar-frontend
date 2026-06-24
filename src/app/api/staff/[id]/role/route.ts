import { proxyMutation } from "@/lib/backend-api"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params
  return proxyMutation(`/staff/${id}/role`, req, "PATCH")
}
