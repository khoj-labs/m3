import { CableIcon, HouseIcon, InboxIcon, icons, LogOutIcon, SettingsIcon, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ListItemText } from "@/components/ui/list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "@/gallery/Section"
import { useAppAlerts, type AppAlert } from "../common/AppAlerts"
import EmptyState from "../common/EmptyState"
import ListPage from "../common/ListPage"
import PageHeader from "../common/PageHeader"
import type { NavItem } from "../config/nav"
import BrandedLayout from "../layouts/BrandedLayout"
import Header from "../layouts/Header"
import UserSettings from "../layouts/UserSettings"
import PageNotFound from "../pages/PageNotFound"
import { isApiError } from "../utils/errorCodes"
import http from "../utils/http"
import Frame from "./Frame"
import GroupHeading from "./GroupHeading"
import Snippet from "./Snippet"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** "arrow-left" | "arrow_left" | "ArrowLeft" | "x" → "ArrowLeft" | "X" */
const toPascal = (name: string) =>
  name.trim().split(/[\s_-]+/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join("")

function resolveIcon(name: string): { found: boolean; Icon: LucideIcon } {
  const Icon = icons[toPascal(name) as keyof typeof icons] as LucideIcon | undefined
  return Icon ? { Icon, found: true } : { Icon: icons.X, found: false }
}

function Field({ children, id, label }: { children: React.ReactNode; id: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

type Connection = { name: string; type: string }

const menu: NavItem[] = [
  { Icon: SettingsIcon, name: "Settings", to: "#UserSettings" },
  { Icon: LogOutIcon, name: "Logout", to: "#UserSettings" },
]

export function PageComponentsGroup() {
  const { addAlert } = useAppAlerts()

  // PageHeader playground
  const [title, setTitle] = useState("Page title")
  const [subtitle, setSubtitle] = useState("")
  const [iconName, setIconName] = useState("x")
  const [withCreate, setWithCreate] = useState(false)
  const [withCrumbs, setWithCrumbs] = useState(false)
  const { Icon, found } = resolveIcon(iconName)

  // ListPage
  const [list, setList] = useState<Connection[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // App Alerts
  const [alertMessage, setAlertMessage] = useState("Saved successfully")
  const [alertType, setAlertType] = useState<AppAlert["type"]>("success")
  const [alertDuration, setAlertDuration] = useState("")

  // User Dropdown
  const [name, setName] = useState("Ada Lovelace")
  const [picture, setPicture] = useState("")

  async function load(url: string) {
    setIsLoading(true)
    setList(null)
    try {
      await sleep(1200) // so the spinner is visible; the request itself is instant
      setList(await http.get<Connection[]>(url))
    }
    catch (error) {
      addAlert({ message: isApiError(error) ? `${error.message} (${error.code})` : String(error), type: "error" })
    }
    finally { setIsLoading(false) }
  }

  const snippet = [
    "<PageHeader",
    `  title=${title}`,
    `  Icon={${found ? toPascal(iconName) : "X"}}`,
    subtitle && `  subtitle="${subtitle}"`,
    withCreate && `  createLink="/add-new"`,
    withCrumbs && `  breadcrumbs={[{ icon: <House />, label: "Home", href: "/" }, { icon: <${found ? toPascal(iconName) : "X"} />, label: "${title}", href: "/list" }]}`,
    "/>",
  ].filter(Boolean).join("\n")

  return (
    <>
      <GroupHeading id="page-components" index={2} title="Page components" description="Page-level pieces: layout chrome, headers, states and route guards." />

      <Section name="Header" title="Header">
        <Frame className="h-24"><Header title="Header" user={{ name: "Ada Lovelace" }} userMenu={menu} /></Frame>
        <Snippet code={`// Reads the side-nav state, so render it inside <AppShell> (or a SideNavCtx.Provider)
<Header title="Dashboard" user={{ name: "Ada Lovelace" }} userMenu={menuItems} />`} />
      </Section>

      <Section name="PageHeader" title="PageHeader">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="ph-title" label="Title"><Input id="ph-title" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field id="ph-subtitle" label="Subtitle (optional)"><Input id="ph-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
          <Field id="ph-icon" label="Icon (any lucide name, e.g. x, anchor, arrow-left)">
            <Input id="ph-icon" aria-invalid={!found} value={iconName} onChange={(e) => setIconName(e.target.value)} />
            {!found && <Typography variant="caption" tone="destructive">No icon named “{iconName}”, showing X.</Typography>}
          </Field>
          <div className="flex items-end gap-6">
            <Label><Switch checked={withCreate} onCheckedChange={setWithCreate} /> Create button</Label>
            <Label><Switch checked={withCrumbs} onCheckedChange={setWithCrumbs} /> Breadcrumbs</Label>
          </div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <PageHeader
            title={title}
            Icon={Icon}
            subtitle={subtitle || undefined}
            createLink={withCreate ? "#PageHeader" : undefined}
            breadcrumbs={withCrumbs ? [{ href: "#PageHeader", icon: <HouseIcon />, label: "Home" }, { href: "#details", icon: <Icon />, label: title }] : undefined}
          />
          <div className="mt-6 flex flex-col gap-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-3/5" /></div>
        </div>
        <Snippet code={snippet} />
      </Section>

      <Section name="ListPage" title="ListPage">
        <Row label="Each button fetches through the http client (the spinner is the isLoading state)">
          <Button onClick={() => load("/demo/connections.json")}>Fetch connections</Button>
          <Button variant="secondary" onClick={() => load("/demo/empty.json")}>Fetch empty list</Button>
          <Button variant="destructive" onClick={() => load("http://localhost:1/connections")}>Simulate failure</Button>
        </Row>
        <div className="rounded-xl border border-border p-4">
          <ListPage
            title="Connections"
            Icon={CableIcon}
            createLink="#ListPage"
            list={list}
            isLoading={isLoading}
            getKey={(c) => c.name}
            renderItem={(c) => <ListItemText primary={c.name} secondary={c.type} />}
            emptyState={list === null ? <EmptyState title="Nothing fetched yet" description="Use a button above." /> : undefined}
          />
        </div>
        <Snippet code={`<ListPage
  title="Connections"
  Icon={Cable}
  createLink="/connections/new"
  list={connections}          // null/[] shows the empty state
  isLoading={isLoading}       // shows the spinner
  getKey={(c) => c.name}
  renderItem={(c) => <ListItemText primary={c.name} secondary={c.type} />}
/>`} />
      </Section>

      <Section name="EmptyState" title="EmptyState">
        <Row label="Default / with description and action / custom icon" className="items-start gap-8">
          <EmptyState />
          <EmptyState title="No messages" description="When someone writes to you, it shows up here." action={<Button>Compose</Button>} />
          <EmptyState title="Inbox zero" Icon={InboxIcon} />
        </Row>
        <Snippet code={`<EmptyState
  title="No messages"
  description="When someone writes to you, it shows up here."
  action={<Button>Compose</Button>}
/>`} />
      </Section>

      <Section name="PrivateRoute" title="PrivateRoute">
        <Typography tone="muted">Auth state is yours; PrivateRoute only needs isAuthenticated, isLoading and redirectTo. Flip the switches inside the preview (it runs in its own router).</Typography>
        <iframe title="PrivateRoute demo" src="/boilerplate/embed/privateroute/secret" loading="lazy" className="h-64 w-full rounded-xl border border-border" />
        <Snippet code={`<Route element={<PrivateRoute isAuthenticated={!!user} isLoading={isLoading} redirectTo="/login" />}>
  <Route path="/account" element={<Account />} />
</Route>`} />
      </Section>

      <Section name="AppAlerts" title="App Alerts">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_10rem_10rem_auto]">
          <Field id="al-msg" label="Message"><Input id="al-msg" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} /></Field>
          <Field id="al-type" label="Type">
            <Select value={alertType} onValueChange={(v) => setAlertType(v as AppAlert["type"])}>
              <SelectTrigger id="al-type"><SelectValue /></SelectTrigger>
              <SelectContent>{(["success", "info", "warning", "error"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="al-dur" label="Duration ms (blank = default)"><Input id="al-dur" inputMode="numeric" value={alertDuration} onChange={(e) => setAlertDuration(e.target.value)} /></Field>
          <Button onClick={() => addAlert({ duration: alertDuration ? Number(alertDuration) : undefined, message: alertMessage, type: alertType })}>Show alert</Button>
        </div>
        <Typography variant="caption" tone="muted">Success and info appear bottom-left for 5s; warnings and errors stay top-right until dismissed.</Typography>
        <Snippet code={`<AppAlerts>
  <App />
</AppAlerts>

const { addAlert } = useAppAlerts()
addAlert({ type: "success", message: "Saved" })                 // bottom-left, 5s
addAlert({ type: "error", message: "Failed", duration: 8000 }) // top-right, sticky unless duration set`} />
      </Section>

      <Section name="SideNav" title="SideNav">
        <Typography tone="muted">Expand or collapse with the chevron; the active item follows the route.</Typography>
        <iframe title="SideNav demo" src="/boilerplate/embed/sidenav/b" loading="lazy" className="h-72 w-full max-w-md rounded-xl border border-border" />
        <Snippet code={`// Normally rendered by <AppShell>; standalone it needs the context
<SideNavCtx.Provider value={{ isFullNav, setIsFullNav }}>
  <SideNav items={navItems} logo={<Logo />} logoCollapsed={<Mark />} />
</SideNavCtx.Provider>`} />
      </Section>

      <Section name="UserSettings" title="User Dropdown">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5"><Label htmlFor="us-name">Name (drives the initials)</Label><Input id="us-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="us-pic">Picture URL (optional)</Label><Input id="us-pic" placeholder="https://…" value={picture} onChange={(e) => setPicture(e.target.value)} /></div>
        </div>
        <Row label="Click the avatar"><UserSettings user={{ name, picture: picture || undefined }} items={menu} /></Row>
        <Snippet code={`<UserSettings
  user={{ name: "Ada Lovelace", picture: avatarUrl }} // no picture: shows initials
  items={[{ Icon: Settings, name: "Settings", to: "/settings" }]}
/>`} />
      </Section>

      <Section name="PageNotFound" title="PageNotFound">
        <PageNotFound homeHref="#PageNotFound" />
        <Snippet code={`<Route path="*" element={<PageNotFound homeHref="/" />} />`} />
      </Section>

      <Section name="BrandedLayout" title="Marketing Layout">
        <Frame className="h-80">
          <BrandedLayout
            logo={<span className="font-heading text-lg font-medium">m3</span>}
            footer={<Typography variant="caption" tone="muted" className="block px-[5%] pb-4">Footer slot</Typography>}
          >
            <PageHeader title="Welcome" subtitle="For logged-out and marketing pages" />
          </BrandedLayout>
        </Frame>
        <Snippet code={`<BrandedLayout logo={<Logo />} footer={<Footer />}>
  <Landing />
</BrandedLayout>`} />
      </Section>

      <Section name="AppShell" title="Page Shell">
        <Typography tone="muted">The whole chrome: header, collapsible side nav and main area. Click the nav items, the chevron and the avatar. It runs in its own router, so it navigates without leaving this page.</Typography>
        <iframe title="AppShell demo" src="/boilerplate/embed/appshell" loading="lazy" className="h-[28rem] w-full rounded-xl border border-border" />
        <Snippet code={`<Route
  element={
    <AppShell
      nav={navItems}
      userMenu={menuItems}
      user={user}
      headerTitle="Dashboard"
      logo={<Logo />}
      logoCollapsed={<Mark />}
    />
  }
>
  <Route index element={<Home />} />   {/* rendered in <main> via <Outlet /> */}
</Route>`} />
      </Section>
    </>
  )
}
