import { proxyData } from "@/lib/backend-api"

type RouteContext = { params: Promise<{ token: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const { token } = await params
  return proxyData(`/staff/invite/${token}`)
}
