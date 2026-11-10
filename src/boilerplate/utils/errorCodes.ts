/**
 * Stable, greppable error codes. Pass them as the first argument to Logger so a log
 * line can be traced to a cause without parsing messages. Add your own groups
 * (e.g. `auth`, `billing`) next to `api` and `common`.
 */
export const ErrorCodes = {
  api: {
    badRequest: 'API-400: Bad request',
    conflict: 'API-409: Conflict',
    forbidden: 'API-403: Forbidden',
    network: 'API-NETWORK: Network error (no response)',
    notFound: 'API-404: Not found',
    rateLimited: 'API-429: Too many requests',
    server: 'API-5XX: Server error',
    timeout: 'API-408: Request timed out',
    unauthorized: 'API-401: Unauthorized',
    unknown: 'API-UNKNOWN: Unexpected API error',
    validation: 'API-422: Validation failed',
  },
  common: {
    missingProvider: 'COM-NO-PROVIDER: Hook used outside its provider',
    uncaughtException: 'COM-ALL-EXP: Uncaught Exception',
  },
} as const

export const fallbackMessage = 'Something went wrong. Please try again, or contact support if it keeps happening.'

const byStatus: Record<number, string> = {
  0: ErrorCodes.api.network,
  400: ErrorCodes.api.badRequest,
  401: ErrorCodes.api.unauthorized,
  403: ErrorCodes.api.forbidden,
  404: ErrorCodes.api.notFound,
  408: ErrorCodes.api.timeout,
  409: ErrorCodes.api.conflict,
  422: ErrorCodes.api.validation,
  429: ErrorCodes.api.rateLimited,
}

/** Maps an HTTP status (0 = no response) to an ErrorCodes.api entry. */
export function errorCodeFromStatus(status: number): string {
  if (byStatus[status]) return byStatus[status]
  return status >= 500 ? ErrorCodes.api.server : ErrorCodes.api.unknown
}

/** Throw this from your fetch wrapper; `code` is ready to hand to Logger. */
export class ApiError extends Error {
  code: string
  status: number

  constructor(status: number, message: string = fallbackMessage) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = errorCodeFromStatus(status)
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError
