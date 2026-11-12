import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavItem } from "../config/nav"

export type AppUser = { name?: string; picture?: string }

const initials = (name?: string) =>
  (name ?? "?").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?"

/** Avatar menu. The user comes from props (no auth provider assumed). */
export default function UserSettings({ user, items }: { items: NavItem[]; user?: AppUser }) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger render={<DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="Open settings" />} />}>
              <Avatar>
                {user?.picture ? <AvatarImage src={user.picture} alt={user.name} referrerPolicy="no-referrer" /> : null}
                <AvatarFallback>{initials(user?.name)}</AvatarFallback>
              </Avatar>
        </TooltipTrigger>
        <TooltipContent>Open settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-48">
        {user?.name ? <><DropdownMenuGroup><DropdownMenuLabel>{user.name}</DropdownMenuLabel></DropdownMenuGroup><DropdownMenuSeparator /></> : null}
        {items.map(({ name, Icon, to }) => (
          <DropdownMenuItem key={name} render={<Link to={to} />}>
            <Icon />{name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
