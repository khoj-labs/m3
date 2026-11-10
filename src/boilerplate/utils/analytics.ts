import type { AnalyticsAdapter, EventName, EventProperties, IdentifyUserArgs } from "./analytics.types"
import { Logger } from "./logger"

/**
 * Provider-agnostic analytics facade (same API as the original, which was hard-wired
 * to PostHog + Mixpanel). Register adapters once at startup:
 *
 *   configureAnalytics({ adapters: [posthogAdapter, mixpanelAdapter] })
 *   init()
 *
 * Like the original it is a no-op in development unless `enabled: true` is passed.
 */
let adapters: AnalyticsAdapter[] = []
let enabled = !import.meta.env.DEV

export function configureAnalytics(options: { adapters: AnalyticsAdapter[]; enabled?: boolean }) {
  adapters = options.adapters
  enabled = options.enabled ?? !import.meta.env.DEV
}

/** One failing provider must never break the app or the other providers. */
function dispatch(action: string, run: (adapter: AnalyticsAdapter) => void) {
  if (!enabled) return
  adapters.forEach((adapter) => {
    try { run(adapter) }
    catch (error) { Logger.error(`ANALYTICS-ADAPTER-FAILED: ${action}`, error) }
  })
}

export function init() {
  dispatch("init", (a) => a.init())
}

export function reset() {
  dispatch("reset", (a) => a.reset())
}

export function trackPageView() {
  dispatch("pageView", (a) => a.pageView())
}

export function trackEvents(eventName: EventName, properties?: EventProperties) {
  dispatch("track", (a) => a.track(eventName, properties))
}

export function identifyUser(args: IdentifyUserArgs) {
  dispatch("identify", (a) => a.identify(args))
}

/** Logs every call through Logger.info — handy while wiring up a real provider. */
export const consoleAdapter: AnalyticsAdapter = {
  identify: (args) => Logger.info("ANALYTICS-IDENTIFY", args),
  init: () => Logger.info("ANALYTICS-INIT"),
  pageView: () => Logger.info("ANALYTICS-PAGEVIEW"),
  reset: () => Logger.info("ANALYTICS-RESET"),
  track: (eventName, properties) => Logger.info(`ANALYTICS-TRACK: ${eventName}`, properties),
}
