import { proxyMutation } from "@/lib/backend-api"

export async function POST(req: Request) {
  return proxyMutation("/payments/sslcommerz/init", req, "POST")
}
