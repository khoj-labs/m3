import { type CacheKey } from "./constants"
import { ErrorCodes } from "./errorCodes"
import { Logger } from "./logger"

/** Typed localStorage helpers. Storage failures (private mode, quota) never throw. */

function read(key: string) {
  try { return localStorage.getItem(key) }
  catch { return null }
}

function write(key: string, value: string) {
  try { localStorage.setItem(key, value) }
  catch (error) { Logger.warn(ErrorCodes.common.cacheWrite, error) }
}

export function save(key: CacheKey, value: string) {
  write(key, value)
}

export function remove(key: CacheKey) {
  try { localStorage.removeItem(key) }
  catch { /* nothing to remove */ }
}

/** Reads a string. With `setToIfNull`, a missing value is stored and returned. */
export function retrieve(key: CacheKey, options: { setToIfNull?: string } = {}): string | null {
  const value = read(key)
  if (value === null && options.setToIfNull !== undefined) {
    write(key, options.setToIfNull)
    return options.setToIfNull
  }
  return value
}

export function saveJson(key: CacheKey, value: unknown) {
  write(key, JSON.stringify(value))
}

/** Reads and parses JSON; returns null (and logs) if the stored value isn't valid JSON. */
export function retrieveJson<T>(key: CacheKey, options: { setToIfNull?: T } = {}): T | null {
  const raw = read(key)
  if (raw === null) {
    if (options.setToIfNull === undefined) return null
    saveJson(key, options.setToIfNull)
    return options.setToIfNull
  }
  try { return JSON.parse(raw) as T }
  catch (error) {
    Logger.warn(ErrorCodes.common.cacheParse, error)
    return null
  }
}
