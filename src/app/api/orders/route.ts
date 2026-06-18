import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/orders", req)
}

export async function POST(req: Request) {
  return proxyMutation("/orders", req, "POST", 201)
}
