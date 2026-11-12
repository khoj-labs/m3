import { HomeIcon, TriangleAlertIcon } from "lucide-react"
import React, { type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { ErrorCodes } from "../utils/errorCodes"
import { Logger } from "../utils/logger"

type Props = {
  children?: ReactNode
  /** Replace the default fallback UI. */
  fallback?: ReactNode
  homeHref?: string
  /** Hook for your logger / error tracker. Defaults to Logger.error(ErrorCodes.common.uncaughtException, …). */
  onError?: (error: Error, info: ErrorInfo) => void
  supportEmail?: string
}

type State = { hasError: boolean }

/** Catches render errors. The default fallback uses plain <a> so it works outside a Router. */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) this.props.onError(error, info)
    else Logger.error(ErrorCodes.common.uncaughtException, `${error}, ${info.componentStack}`)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback
    const { homeHref = "/", supportEmail } = this.props
    return (
      <div role="alert" className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 text-center">
        <TriangleAlertIcon className="size-16 text-destructive" aria-hidden />
        <Typography variant="headline">Something went wrong</Typography>
        {supportEmail ? (
          <a className="text-primary underline underline-offset-4" href={`mailto:${supportEmail}`}>Please contact us: {supportEmail}</a>
        ) : null}
        <Button size="lg" nativeButton={false} render={<a href={homeHref} />}><HomeIcon data-icon="inline-start" />Take Me Home</Button>
      </div>
    )
  }
}

export { ErrorBoundary }
