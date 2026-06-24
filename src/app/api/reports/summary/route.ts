import { proxyData } from "@/lib/backend-api"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString()
  return proxyData(`/reports/summary?${search}`)
}
