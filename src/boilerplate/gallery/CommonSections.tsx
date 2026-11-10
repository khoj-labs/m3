import { CableIcon, FolderIcon, HouseIcon, InboxIcon, icons, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ListItemText } from "@/components/ui/list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "@/gallery/Section"
import ActionButtonGroup from "../common/ActionButtonGroup"
import { useAppAlerts, type AppAlert } from "../common/AppAlerts"
import BreadcrumbsNavigation from "../common/BreadcrumbsNavigation"
import EmptyState from "../common/EmptyState"
import ErrorBoundary from "../common/ErrorBoundary"
import ListPage from "../common/ListPage"
import PageHeader from "../common/PageHeader"
import Spinner from "../common/Spinner"
import SpinnerButton from "../common/SpinnerButton"
import { isApiError } from "../utils/errorCodes"
import http from "../utils/http"
import Frame from "./Frame"

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

function Bomb(): React.ReactNode {
  throw new Error("Demo render error")
}

type Connection = { name: string; type: string }

export function CommonSections() {
  const { addAlert } = useAppAlerts()

  // Spinner / SpinnerButton
  const [fullPage, setFullPage] = useState(false)
  const [busy, setBusy] = useState(false)

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

  // AppAlerts
  const [alertMessage, setAlertMessage] = useState("Saved successfully")
  const [alertType, setAlertType] = useState<AppAlert["type"]>("success")
  const [alertDuration, setAlertDuration] = useState("")

  // ErrorBoundary
  const [crashDefault, setCrashDefault] = useState(false)
  const [crashCustom, setCrashCustom] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [caught, setCaught] = useState("")

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
    `  title="${title}"`,
    `  Icon={${found ? toPascal(iconName) : "X"}}`,
    subtitle && `  subtitle="${subtitle}"`,
    withCreate && '  createLink="/new"',
    withCrumbs && '  breadcrumbs={[{ icon: <House />, label: "Home", href: "/" }, { label: "Details", href: "/details" }]}',
    "/>",
  ].filter(Boolean).join("\n")

  return (
    <>
      <Section name="Spinner" title="Spinner">
        <Row label="Sizes">
          <Spinner size="sm" className="w-auto py-0" />
          <Spinner className="w-auto py-0" />
          <Spinner size="lg" className="w-auto py-0" />
        </Row>
        <Row label="fullPage (positioned in the upper third of its container)">
          <Button variant="outline" onClick={() => { setFullPage(true); setTimeout(() => setFullPage(false), 2000) }}>Show for 2s</Button>
        </Row>
        <Frame className="h-40">{fullPage ? <Spinner fullPage /> : <Typography tone="muted" className="p-4">Container for the fullPage spinner</Typography>}</Frame>
      </Section>

      <Section name="SpinnerButton" title="SpinnerButton">
        <Row label="Click to load for 1.5s / always loading / disabled">
          <SpinnerButton isLoading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1500) }}>Save</SpinnerButton>
          <SpinnerButton isLoading variant="secondary">Loading</SpinnerButton>
          <SpinnerButton isLoading variant="outline">Outline loading</SpinnerButton>
          <SpinnerButton disabled>Disabled</SpinnerButton>
        </Row>
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
            breadcrumbs={withCrumbs ? [{ href: "#PageHeader", icon: <HouseIcon />, label: "Home" }, { href: "#details", label: "Details" }] : undefined}
          />
          <div className="mt-6 flex flex-col gap-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-3/5" /></div>
        </div>
        <pre className="overflow-auto rounded-lg bg-md-surface-container-high p-3 text-xs">{snippet}</pre>
      </Section>

      <Section name="BreadcrumbsNavigation" title="BreadcrumbsNavigation">
        <BreadcrumbsNavigation items={[
          { href: "#BreadcrumbsNavigation", icon: <HouseIcon />, label: "Home" },
          { href: "#projects", icon: <FolderIcon />, label: "Projects" },
          { href: "#details", label: "Details (current page)" },
        ]} />
      </Section>

      <Section name="ActionButtonGroup" title="ActionButtonGroup">
        <ActionButtonGroup>
          <Button variant="ghost">Cancel</Button>
          <Button variant="outline">Save draft</Button>
          <Button>Publish</Button>
        </ActionButtonGroup>
      </Section>

      <Section name="EmptyState" title="EmptyState">
        <Row label="Default / with description and action / custom icon" className="items-start gap-8">
          <EmptyState />
          <EmptyState title="No messages" description="When someone writes to you, it shows up here." action={<Button>Compose</Button>} />
          <EmptyState title="Inbox zero" Icon={InboxIcon} />
        </Row>
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
      </Section>

      <Section name="AppAlerts" title="AppAlerts">
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
      </Section>

      <Section name="ErrorBoundary" title="ErrorBoundary">
        <Row label="Default fallback / custom fallback + onError">
          <Button variant="destructive" onClick={() => setCrashDefault(true)}>Crash (default)</Button>
          <Button variant="destructive" onClick={() => setCrashCustom(true)}>Crash (custom)</Button>
          <Button variant="outline" onClick={() => { setCrashDefault(false); setCrashCustom(false); setCaught(""); setResetKey((k) => k + 1) }}>Reset</Button>
        </Row>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <ErrorBoundary key={`d${resetKey}`} homeHref="#ErrorBoundary" supportEmail="help@example.com">
              {crashDefault ? <Bomb /> : <Typography tone="muted">Healthy child. Press “Crash (default)”.</Typography>}
            </ErrorBoundary>
          </div>
          <div className="rounded-xl border border-border p-4">
            <ErrorBoundary
              key={`c${resetKey}`}
              fallback={<Alert variant="destructive"><AlertTitle>Custom fallback</AlertTitle><AlertDescription>This widget crashed; the rest of the page is fine.</AlertDescription></Alert>}
              onError={(error) => setCaught(error.message)}
            >
              {crashCustom ? <Bomb /> : <Typography tone="muted">Healthy child. Press “Crash (custom)”.</Typography>}
            </ErrorBoundary>
            {caught && <Typography variant="caption" tone="muted" className="mt-2 block">onError received: {caught}</Typography>}
          </div>
        </div>
      </Section>

      <Section name="PrivateRoute" title="PrivateRoute">
        <Typography tone="muted">Auth state is yours; PrivateRoute only needs isAuthenticated, isLoading and redirectTo. Flip the switches inside the preview (it runs in its own router).</Typography>
        <iframe title="PrivateRoute demo" src="/boilerplate/embed/privateroute/secret" loading="lazy" className="h-64 w-full rounded-xl border border-border" />
      </Section>
    </>
  )
}
