import { retrieve } from "./cache"
import { CacheKeys } from "./constants"
import { ApiError, fallbackMessage } from "./errorCodes"
import { getSessionId, Logger } from "./logger"

type HttpConfig = {
  /** Prepended to relative URLs, e.g. "https://api.example.com". */
  baseUrl: string
  /** Return the bearer token (or null when signed out). Defaults to CacheKeys.token in localStorage. */
  getToken: () => string | null | Promise<string | null>
  timeoutMs: number
}

const config: HttpConfig = { baseUrl: "", getToken: () => retrieve(CacheKeys.token), timeoutMs: 30_000 }

export function configureHttp(options: Partial<HttpConfig>) {
  Object.assign(config, options)
}

type RequestOptions = {
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT"
  body?: object
}

/** Errors with a body are assumed to be `{ message: string }`; falls back to statusText. */
async function messageFrom(response: Response) {
  try {
    const body = (await response.json()) as { message?: unknown }
    if (typeof body.message === "string" && body.message) return body.message
  }
  catch { /* body wasn't JSON */ }
  return response.statusText || fallbackMessage
}

async function request<T>(path: string, { body, method }: RequestOptions): Promise<T> {
  const url = /^https?:\/\//.test(path) ? path : `${config.baseUrl}${path}`
  const token = await config.getToken()
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Request-ID": crypto.randomUUID(),
    "X-Session-ID": getSessionId(),
  })
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeoutMs)
  try {
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      headers,
      method,
      signal: controller.signal,
    })
    if (!response.ok) throw new ApiError(response.status, await messageFrom(response))
    // 201/204 and other empty responses
    if (response.status === 204 || response.headers.get("content-length") === "0") return {} as T
    try { return (await response.json()) as T }
    catch { throw new ApiError(response.status, "The server returned an invalid response.") }
  }
  catch (error) {
    const apiError = toApiError(error)
    Logger.error(apiError.code, `${method} ${url} failed: ${apiError.message}`)
    throw apiError
  }
  finally {
    clearTimeout(timer)
  }
}

/** Anything that isn't already an ApiError is a network failure or a timeout. */
function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError(408, "The request timed out.")
  }
  return new ApiError(0, "Could not reach the server. Check your connection.")
}

const http = {
  delete: <T = unknown>(url: string) => request<T>(url, { method: "DELETE" }),
  get: <T = unknown>(url: string) => request<T>(url, { method: "GET" }),
  patch: <T = unknown>(url: string, body: object) => request<T>(url, { body, method: "PATCH" }),
  post: <T = unknown>(url: string, body: object) => request<T>(url, { body, method: "POST" }),
  put: <T = unknown>(url: string, body: object) => request<T>(url, { body, method: "PUT" }),
}

export default http
