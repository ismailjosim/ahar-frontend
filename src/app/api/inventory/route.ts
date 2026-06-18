import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/inventory", req)
}

export async function POST(req: Request) {
  return proxyMutation("/inventory", req, "POST", 201)
}
