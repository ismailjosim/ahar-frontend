import { proxyList, proxyMutation } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/staff", req)
}

export async function POST(req: Request) {
  return proxyMutation("/staff/invite", req, "POST", 201)
}
