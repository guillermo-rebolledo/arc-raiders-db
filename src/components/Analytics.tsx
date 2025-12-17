export function UmamiAnalytics() {
  return (
    <script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id="e73c9775-573b-4346-8779-7cd17e6921e9"
    />
  )
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>,
) {
  if (typeof window !== 'undefined' && (window as any).umami) {
    ;(window as any).umami.track(eventName, eventData)
  }
}

/**
 * Track page views manually
 */
export function trackPageView(url?: string) {
  if (typeof window !== 'undefined' && (window as any).umami) {
    ;(window as any).umami.track((props: any) => ({
      ...props,
      url: url || window.location.pathname,
    }))
  }
}
