import { useMemo, useState, type ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { NavItem } from "../config/nav"
import Header from "./Header"
import SideNav, { SideNavCtx } from "./SideNav"
import type { AppUser } from "./UserSettings"

type Props = {
  nav: NavItem[]
  userMenu: NavItem[]
  user?: AppUser
  logo?: ReactNode
  logoCollapsed?: ReactNode
  headerTitle?: string
  /** Defaults to <Outlet /> so it can be used as a layout route. */
  children?: ReactNode
}

/**
 * Header + collapsible side nav + main area (the original `Borders`, minus the Auth0 gate:
 * render it only on routes where you want the chrome).
 */
export default function AppShell({ nav, userMenu, user, logo, logoCollapsed, headerTitle, children }: Props) {
  const [isFullNav, setIsFullNav] = useState(false)
  const ctx = useMemo(() => ({ isFullNav, setIsFullNav }), [isFullNav])
  return (
    <SideNavCtx.Provider value={ctx}>
      <TooltipProvider>
        <SideNav items={nav} logo={logo} logoCollapsed={logoCollapsed} />
        <Header title={headerTitle} user={user} userMenu={userMenu} />
        <main
          data-expanded={isFullNav}
          className="ml-(--layout-sidebar-width-collapsed) p-6 pt-[calc(var(--layout-appbar-height)+1.5rem)] transition-[margin] duration-(--motion-duration-medium) ease-emphasized data-[expanded=true]:ml-(--layout-sidebar-width)"
        >
          {children ?? <Outlet />}
        </main>
      </TooltipProvider>
    </SideNavCtx.Provider>
  )
}
