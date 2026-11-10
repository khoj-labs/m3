import { AnchorIcon, CableIcon, LogOutIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"
import ActionButtonGroup from "../common/ActionButtonGroup"
import { useAppAlerts } from "../common/AppAlerts"
import AppAlerts from "../common/AppAlerts"
import ErrorBoundary from "../common/ErrorBoundary"
import ListPage from "../common/ListPage"
import PageHeader from "../common/PageHeader"
import SpinnerButton from "../common/SpinnerButton"
import type { NavItem } from "../config/nav"
import AppShell from "../layouts/AppShell"
import PageNotFound from "../pages/PageNotFound"
import { configureAnalytics, consoleAdapter, trackEvents } from "../utils/analytics"
import { Events } from "../utils/analytics.types"
import { ApiError } from "../utils/errorCodes"
import { Logger } from "../utils/logger"

// Demo only: log analytics calls to the console even in dev.
configureAnalytics({ adapters: [consoleAdapter], enabled: true })

const base = "/boilerplate"
const home: NavItem = { name: "Landing Page", Icon: AnchorIcon, to: base }
const connections: NavItem = { name: "Connections", Icon: CableIcon, to: `${base}/connections`, createLink: `${base}/connections/new` }
const settings: NavItem = { name: "Settings", Icon: SettingsIcon, to: `${base}/settings` }
const logout: NavItem = { name: "Logout", Icon: LogOutIcon, to: `${base}/logout` }

function Bomb(): React.ReactNode {
  throw new Error("Demo render error")
}

function HomePage() {
  const { addAlert } = useAppAlerts()
  const [busy, setBusy] = useState(false)
  const [crash, setCrash] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Getting Started"
        subtitle="Boilerplate components in action"
        Icon={AnchorIcon}
        breadcrumbs={[{ icon: <AnchorIcon />, label: "Home", href: base }, { label: "Getting Started", href: `${base}/start` }]}
      />
      <ActionButtonGroup>
        <Button asChild variant="outline"><Link to={`${base}/missing`}>Go to a missing page</Link></Button>
        <SpinnerButton isLoading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1500) }}>Save (1.5s)</SpinnerButton>
        <Button variant="secondary" onClick={() => trackEvents(Events.SIGNUP, { plan: "pro" })}>Track event</Button>
        <Button variant="secondary" onClick={() => addAlert({ type: "success", message: "Saved successfully" })}>Success alert</Button>
        <Button variant="secondary" onClick={() => addAlert({ type: "error", message: "Something broke" })}>Error alert</Button>
        <Button variant="secondary" onClick={() => { const e = new ApiError(404, "Connection not found"); Logger.error(e.code, e); addAlert({ type: "error", message: `${e.message} (${e.status})` }) }}>API 404</Button>
        <Button variant="destructive" onClick={() => setCrash(true)}>Crash a child</Button>
      </ActionButtonGroup>
      <ErrorBoundary homeHref={base} supportEmail="help@example.com">{crash ? <Bomb /> : <Typography tone="muted">Press “Crash a child” to see the ErrorBoundary fallback.</Typography>}</ErrorBoundary>
    </div>
  )
}

function ConnectionsPage() {
  const [mode, setMode] = useState<"data" | "loading" | "empty">("data")
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="single" variant="outline" size="sm" value={mode} onValueChange={(v) => v && setMode(v as typeof mode)}>
        <ToggleGroupItem value="data">data</ToggleGroupItem>
        <ToggleGroupItem value="loading">loading</ToggleGroupItem>
        <ToggleGroupItem value="empty">empty</ToggleGroupItem>
      </ToggleGroup>
      <ListPage
        title={connections.name}
        Icon={connections.Icon}
        createLink={connections.createLink}
        isLoading={mode === "loading"}
        list={mode === "empty" ? [] : ["Postgres", "Stripe", "Slack"]}
      />
    </div>
  )
}

export default function BoilerplateDemo() {
  return (
    <AppAlerts>
      <Routes>
        <Route
          element={
            <AppShell
              nav={[home, connections]}
              userMenu={[connections, settings, logout]}
              user={{ name: "Ada Lovelace" }}
              logo={<span className="font-heading text-lg font-medium">Boilerplate</span>}
              logoCollapsed={<span className="font-heading text-lg font-medium">B</span>}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="*" element={<PageNotFound homeHref={base} />} />
        </Route>
      </Routes>
    </AppAlerts>
  )
}
