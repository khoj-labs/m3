import { AnchorIcon, CableIcon, HouseIcon, InboxIcon, LogOutIcon, SearchIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import PageHeader from "../common/PageHeader"
import PrivateRoute from "../common/PrivateRoute"
import AppShell from "../layouts/AppShell"
import SideNav, { SideNavCtx } from "../layouts/SideNav"

/**
 * Pages rendered inside the gallery's <iframe>s. They need their own router (react-router
 * forbids nesting) and, for fixed-position components, a real viewport.
 * URLs: /boilerplate/embed/{appshell,sidenav,privateroute}
 */
const base = "/boilerplate/embed"

const logo = <span className="font-heading text-lg font-medium">m3</span>
const logoCollapsed = <span className="font-heading text-lg font-medium">m</span>

function AppShellEmbed() {
  return (
    <Routes>
      <Route
        element={
          <AppShell
            nav={[
              { Icon: AnchorIcon, name: "Getting started", to: `${base}/appshell` },
              { Icon: CableIcon, name: "Connections", to: `${base}/appshell/connections` },
            ]}
            userMenu={[
              { Icon: SettingsIcon, name: "Settings", to: `${base}/appshell/settings` },
              { Icon: LogOutIcon, name: "Logout", to: `${base}/appshell/logout` },
            ]}
            user={{ name: "Ada Lovelace" }}
            headerTitle="AppShell"
            logo={logo}
            logoCollapsed={logoCollapsed}
          />
        }
      >
        <Route index element={<PageHeader title="Getting started" Icon={AnchorIcon} subtitle="Rendered in the main area. Try the nav and the chevron." />} />
        <Route path="connections" element={<PageHeader title="Connections" Icon={CableIcon} />} />
        <Route path="*" element={<PageHeader title="Another page" subtitle="From the avatar menu" />} />
      </Route>
    </Routes>
  )
}

function SideNavEmbed() {
  const [isFullNav, setIsFullNav] = useState(true)
  return (
    <TooltipProvider>
      <SideNavCtx.Provider value={{ isFullNav, setIsFullNav }}>
        <SideNav
          items={[
            { Icon: HouseIcon, name: "Home", to: `${base}/sidenav/a` },
            { Icon: SearchIcon, name: "Search", to: `${base}/sidenav/b` },
            { Icon: InboxIcon, name: "Inbox", to: `${base}/sidenav/c` },
          ]}
          logo={logo}
          logoCollapsed={logoCollapsed}
        />
      </SideNavCtx.Provider>
      <Typography tone="muted" className="p-6 pl-[calc(var(--layout-sidebar-width)+1.5rem)]">Content area. The active item follows the route.</Typography>
    </TooltipProvider>
  )
}

function PrivateRouteEmbed() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  // Re-enter the protected route when auth state changes, like a real app would on sign-in/out.
  // (Done in handlers, not an effect: an effect on mount races the redirect and leaves a blank page.)
  const reenter = () => { void navigate(`${base}/privateroute/secret`, { replace: true }) }
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-6">
        <Label><Switch checked={isAuthenticated} onCheckedChange={(v) => { setIsAuthenticated(v); reenter() }} /> isAuthenticated</Label>
        <Label><Switch checked={isLoading} onCheckedChange={(v) => { setIsLoading(v); reenter() }} /> isLoading</Label>
      </div>
      <Routes>
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo={`${base}/privateroute/login`} />}>
          <Route path="secret" element={<Alert><AlertTitle>Secret content</AlertTitle><AlertDescription>You are signed in.</AlertDescription></Alert>} />
        </Route>
        <Route path="login" element={<Alert variant="destructive"><AlertTitle>Redirected to /login</AlertTitle><AlertDescription>Not authenticated.</AlertDescription></Alert>} />
      </Routes>
    </div>
  )
}

export default function EmbedRoutes() {
  return (
    <Routes>
      <Route path="appshell/*" element={<AppShellEmbed />} />
      <Route path="sidenav/*" element={<SideNavEmbed />} />
      <Route path="privateroute/*" element={<PrivateRouteEmbed />} />
    </Routes>
  )
}
