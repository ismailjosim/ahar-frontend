import { proxyList } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyList("/orders/my", req)
}
