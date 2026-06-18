import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/payments", req)
}

export async function POST(req: Request) {
  return proxyMutation("/payments", req, "POST", 201)
}
