import { AppBar, AppBarActions, AppBarTitle } from "@/components/ui/app-bar"
import type { NavItem } from "../config/nav"
import UserSettings, { type AppUser } from "./UserSettings"
import { useSideNav } from "./SideNav"

export default function Header({ title, user, userMenu }: { title?: string; user?: AppUser; userMenu: NavItem[] }) {
  const { isFullNav } = useSideNav()
  return (
    <AppBar
      position="fixed"
      color="container"
      data-expanded={isFullNav}
      className="left-(--layout-sidebar-width-collapsed) h-(--layout-appbar-height) w-auto transition-[left] duration-(--motion-duration-medium) ease-emphasized data-[expanded=true]:left-(--layout-sidebar-width)"
    >
      {title ? <AppBarTitle>{title}</AppBarTitle> : null}
      <AppBarActions><UserSettings user={user} items={userMenu} /></AppBarActions>
    </AppBar>
  )
}
