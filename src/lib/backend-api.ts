import { NextResponse } from "next/server"

type BackendBody<T = unknown> = {
  success?: boolean
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
  data?: T
  error?: unknown
}

const API_VERSION = "/api/v1"

function getBackendBaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
  const cleanUrl = rawUrl.replace(/\/$/, "")

  return cleanUrl.endsWith(API_VERSION) ? cleanUrl : `${cleanUrl}${API_VERSION}`
}

function getTargetPath(path: string, req?: Request) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (!req) return normalizedPath

  const url = new URL(req.url)
  const query = url.searchParams.toString()

  return query ? `${normalizedPath}?${query}` : normalizedPath
}

async function requestBackend<T>(path: string, init: RequestInit = {}): Promise<BackendBody<T>> {
  const headers = new Headers(init.headers)

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    })
    const body = (await response.json().catch(() => ({}))) as BackendBody<T>

    if (!response.ok) {
      return {
        success: false,
        message: body.message || "Backend request failed",
        error: body.error || body,
      }
    }

    return body
  } catch (error) {
    return {
      success: false,
      message: "Unable to reach backend API",
      error,
    }
  }
}

export async function proxyList<T>(path: string, req: Request) {
  const cookie = req.headers.get("cookie")
  const body = await requestBackend<T[]>(getTargetPath(path, req), {
    headers: cookie ? { cookie } : undefined,
  })

  if (body.success === false) {
    return NextResponse.json(body, { status: 500 })
  }

  return NextResponse.json({
    data: body.data || [],
    total: body.meta?.total || 0,
  })
}

export async function proxyData<T>(path: string, options: RequestInit & { status?: number } = {}) {
  const { status, ...init } = options
  const body = await requestBackend<T>(path, init)

  if (body.success === false) {
    return NextResponse.json({ error: body.message || "Backend request failed" }, { status: 500 })
  }

  return NextResponse.json(body.data ?? null, { status: status || 200 })
}

export async function proxyMutation<T>(path: string, req: Request, method: "POST" | "PATCH", status?: number) {
  try {
    const payload = await req.json()
    const cookie = req.headers.get("cookie")

    return proxyData<T>(path, {
      method,
      body: JSON.stringify(payload),
      status,
      headers: cookie ? { cookie } : undefined,
    })
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

export async function proxyDelete(path: string, req?: Request) {
  const cookie = req?.headers.get("cookie")
  const body = await requestBackend(path, {
    method: "DELETE",
    headers: cookie ? { cookie } : undefined,
  })

  if (body.success === false) {
    return NextResponse.json({ error: body.message || "Backend request failed" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function proxyCsv(path: string, req: Request) {
  const targetPath = getTargetPath(path, req)
  const response = await fetch(`${getBackendBaseUrl()}${targetPath}`, {
    cache: "no-store",
  })
  const text = await response.text()

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "text/csv",
      "Content-Disposition": response.headers.get("Content-Disposition") || 'attachment; filename="ahar-report.csv"',
    },
  })
}
