// import { getCookie } from '@/services/auth/tokenHandlers'
// import { getNewAccessToken } from '../services/auth/authService'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const AUTH_REFRESH_EXCLUDED_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/forget-password",
  "/auth/refresh-token",
]

const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
  const { headers, body, ...restOptions } = options
  // const accessToken = await getCookie('accessToken')
  console.log("accessToken", headers)

  if (!BACKEND_API_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not configured")
  }

  // When the body is FormData, do NOT set Content-Type manually.
  // fetch() will automatically set "multipart/form-data; boundary=<...>"
  // with the correct boundary string. Setting it manually breaks the
  // boundary and causes Express's JSON body-parser to receive a raw
  // multipart stream → PayloadTooLargeError or parse failure.

  const isFormData = body instanceof FormData

  // if (!AUTH_REFRESH_EXCLUDED_ENDPOINTS.includes(endpoint)) {
  // 	await getNewAccessToken()
  // }

  const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    body,
    headers: {
      // Only default to JSON when not sending FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
      // Caller-supplied headers always win (e.g. explicit JSON patch)
      ...headers,
    },
    ...restOptions,
  })

  return res
}

export const serverFetch = {
  get: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { method: "GET", ...options }),

  post: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { method: "POST", ...options }),

  put: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { method: "PUT", ...options }),

  patch: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { method: "PATCH", ...options }),

  delete: (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { method: "DELETE", ...options }),
}

// serverFetch.get('/auth/me')
// serverFetch.post('/auth/register',{body: JSON.stringify({})})
