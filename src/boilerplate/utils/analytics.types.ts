export const Events = {
  API_REQUEST: 'api_request',
  LOGIN: 'login',
  PAGE_VIEW: 'page_view',
  SIGNUP: 'signup',
} as const

export type EventName = (typeof Events)[keyof typeof Events]

export type NetworkEvent = {
  request_method: string
  response: string
  response_status: number
  url: string
  request_payload?: FormData | string
}

export type EventProperties = NetworkEvent | Record<string, unknown>

export type IdentifyUserArgs = {
  userId: string
  /** Traits to set on every call. */
  set?: Record<string, unknown>
  /** Traits to set only if not already present. */
  setOnce?: Record<string, unknown>
}

/**
 * What a provider (PostHog, Mixpanel, Segment, …) must implement. Wrap its SDK in
 * an object with these five methods and pass it to `configureAnalytics`.
 */
export type AnalyticsAdapter = {
  identify: (args: IdentifyUserArgs) => void
  init: () => void
  pageView: () => void
  reset: () => void
  track: (eventName: string, properties?: EventProperties) => void
}
