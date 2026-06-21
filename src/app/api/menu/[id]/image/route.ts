import { type NextRequest } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

// Forwards multipart image uploads to the Express backend.
// Uses a raw fetch instead of proxyMutation because the body is FormData, not JSON.
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001"

  const formData = await req.formData()

  const response = await fetch(`${backendUrl}/api/v1/menu/${id}/image`, {
    method: "POST",
    // Forward the session cookie so better-auth can authenticate the request.
    headers: { cookie: req.headers.get("cookie") ?? "" },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))
  return Response.json(data, { status: response.status })
}
