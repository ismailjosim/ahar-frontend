import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/reservations", req)
}

export async function POST(req: Request) {
  return proxyMutation("/reservations", req, "POST", 201)
}
