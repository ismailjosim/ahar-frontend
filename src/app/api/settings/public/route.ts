import { proxyData } from "@/lib/backend-api"

export const GET = () => proxyData("/settings/public")
