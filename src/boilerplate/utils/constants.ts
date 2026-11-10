/** localStorage keys, in one place so nothing hard-codes a string. */
export const CacheKeys = {
  orgId: 'org-id',
  profileSrc: 'profile-src',
  sessionId: 'session-id',
  token: 'token',
  userId: 'user-id',
} as const

export type CacheKey = (typeof CacheKeys)[keyof typeof CacheKeys]
