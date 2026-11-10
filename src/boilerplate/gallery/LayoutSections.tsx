import { LogOutIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "@/gallery/Section"
import PageHeader from "../common/PageHeader"
import type { NavItem } from "../config/nav"
import BrandedLayout from "../layouts/BrandedLayout"
import Header from "../layouts/Header"
import UserSettings from "../layouts/UserSettings"
import PageNotFound from "../pages/PageNotFound"
import Frame from "./Frame"

const menu: NavItem[] = [
  { Icon: SettingsIcon, name: "Settings", to: "#UserSettings" },
  { Icon: LogOutIcon, name: "Logout", to: "#UserSettings" },
]

export function LayoutSections() {
  const [name, setName] = useState("Ada Lovelace")
  const [picture, setPicture] = useState("")

  return (
    <>
      <Section name="AppShell" title="AppShell">
        <Typography tone="muted">The whole chrome: header, collapsible side nav and main area. Click the nav items, the chevron and the avatar. It runs in its own router, so it navigates without leaving this page.</Typography>
        <iframe title="AppShell demo" src="/boilerplate/embed/appshell" loading="lazy" className="h-[28rem] w-full rounded-xl border border-border" />
      </Section>

      <Section name="Header" title="Header">
        <Frame className="h-24"><Header title="Header" user={{ name: "Ada Lovelace" }} userMenu={menu} /></Frame>
      </Section>

      <Section name="SideNav" title="SideNav">
        <Typography tone="muted">Expand or collapse with the chevron; the active item follows the route.</Typography>
        <iframe title="SideNav demo" src="/boilerplate/embed/sidenav/b" loading="lazy" className="h-72 w-full max-w-md rounded-xl border border-border" />
      </Section>

      <Section name="UserSettings" title="UserSettings">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5"><Label htmlFor="us-name">Name (drives the initials)</Label><Input id="us-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="us-pic">Picture URL (optional)</Label><Input id="us-pic" placeholder="https://…" value={picture} onChange={(e) => setPicture(e.target.value)} /></div>
        </div>
        <Row label="Click the avatar"><UserSettings user={{ name, picture: picture || undefined }} items={menu} /></Row>
      </Section>

      <Section name="BrandedLayout" title="BrandedLayout">
        <Frame className="h-80">
          <BrandedLayout
            logo={<span className="font-heading text-lg font-medium">m3</span>}
            footer={<Typography variant="caption" tone="muted" className="block px-[5%] pb-4">Footer slot</Typography>}
          >
            <PageHeader title="Welcome" subtitle="For logged-out and marketing pages" />
          </BrandedLayout>
        </Frame>
      </Section>

      <Section name="PageNotFound" title="PageNotFound">
        <PageNotFound homeHref="#PageNotFound" />
      </Section>
    </>
  )
}
