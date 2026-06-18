import { proxyCsv } from "@/lib/backend-api"

export async function GET(req: Request) {
  return proxyCsv("/reports/export", req)
}
