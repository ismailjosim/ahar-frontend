import { proxyData, proxyMutation } from "@/lib/backend-api"

export async function GET() {
  return proxyData("/settings")
}

export async function PATCH(req: Request) {
  return proxyMutation("/settings", req, "PATCH")
}
