import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/menu", req)
}

export async function POST(req: Request) {
  return proxyMutation("/menu", req, "POST", 201)
}
