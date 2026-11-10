import { CacheKeys } from './constants'

/**
 * The only module that may call `console` (enforced by the `no-console` lint rule).
 * Every entry carries the error code, level, page, session and user so logs can be
 * correlated; swap `emit` for a remote sink (Sentry, Datadog, …) in one place.
 */
export const levels = { ERROR: 'error', INFO: 'info', WARN: 'warn' } as const

export type Level = (typeof levels)[keyof typeof levels]

export type LogObject = {
  errorCode: string
  level: Level
  pageUrl: string
  sessionId: string
  userId: string
}

const read = (key: string) => {
  try { return localStorage.getItem(key) }
  catch { return null }
}

const write = (key: string, value: string) => {
  try { localStorage.setItem(key, value) }
  catch { /* storage unavailable (private mode, SSR) — logging must never throw */ }
}

export function getSessionId() {
  const existing = read(CacheKeys.sessionId)
  if (existing) return existing
  const created = crypto.randomUUID()
  write(CacheKeys.sessionId, created)
  return created
}

/** Call after sign-in so subsequent logs are attributed to the user. */
export function setLogUserId(userId: string) {
  write(CacheKeys.userId, userId)
}

const isSilent = () => import.meta.env.MODE === 'test'

function emit(logObject: LogObject, args?: unknown) {
  if (isSilent()) return
  console[logObject.level](logObject, args)
}

const log = (level: Level) => (errorCode: string, args?: unknown) => {
  emit(
    {
      errorCode,
      level,
      pageUrl: `${window.location.hostname}${window.location.pathname}`,
      sessionId: getSessionId(),
      userId: read(CacheKeys.userId) ?? 'unknown-user',
    },
    args,
  )
}

export const Logger = {
  error: log(levels.ERROR),
  info: log(levels.INFO),
  warn: log(levels.WARN),
}
