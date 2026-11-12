import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { createContext, useContext } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { List, ListItem, ListItemIcon } from "@/components/ui/list"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavItem } from "../config/nav"

type SideNavState = { isFullNav: boolean; setIsFullNav: (v: boolean) => void }
export const SideNavCtx = createContext<SideNavState>({ isFullNav: false, setIsFullNav: () => {} })
export const useSideNav = () => useContext(SideNavCtx)

type Props = {
  items: NavItem[]
  /** Full-width logo, shown when expanded. */
  logo?: React.ReactNode
  /** Compact mark, shown when collapsed. */
  logoCollapsed?: React.ReactNode
}

export default function SideNav({ items, logo, logoCollapsed }: Props) {
  const { isFullNav, setIsFullNav } = useSideNav()
  return (
    <nav
      aria-label="Primary"
      data-slot="side-nav"
      data-expanded={isFullNav}
      className="fixed inset-y-0 left-0 z-40 flex w-(--layout-sidebar-width-collapsed) flex-col border-r border-md-outline-variant bg-md-surface-container-low transition-[width] duration-(--motion-duration-medium) ease-emphasized data-[expanded=true]:w-(--layout-sidebar-width)"
    >
      <div className="flex h-(--layout-appbar-height) shrink-0 items-center justify-between gap-1 border-b border-md-outline-variant px-3">
        <div className="min-w-0 overflow-hidden">{isFullNav ? logo : logoCollapsed}</div>
        <Button variant="ghost" size="icon" aria-label={isFullNav ? "Collapse navigation" : "Expand navigation"} onClick={() => setIsFullNav(!isFullNav)}>
          {isFullNav ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Button>
      </div>
      <List className="px-2 py-2">
        {items.map(({ name, Icon, to }) => (
          <NavLink key={name} to={to} end>
            {({ isActive }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <ListItem render={<span />} selected={isActive}>
                    <ListItemIcon><Icon /></ListItemIcon>
                    {isFullNav ? <span className="truncate text-sm">{name}</span> : <span className="sr-only">{name}</span>}
                  </ListItem>
                </TooltipTrigger>
                {!isFullNav && <TooltipContent side="right">{name}</TooltipContent>}
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>
    </nav>
  )
}
