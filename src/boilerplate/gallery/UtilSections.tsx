import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "@/gallery/Section"
import { configureAnalytics, identifyUser, init, reset, trackEvents, trackPageView } from "../utils/analytics"
import { Events, type AnalyticsAdapter, type EventName } from "../utils/analytics.types"
import { baseUrl } from "../utils/apiUrls"
import apiUrls from "../utils/apiUrls"
import { remove, retrieve, retrieveJson, save, saveJson } from "../utils/cache"
import { CacheKeys, type CacheKey } from "../utils/constants"
import { ApiError, ErrorCodes, errorCodeFromStatus, isApiError } from "../utils/errorCodes"
import http from "../utils/http"
import { Logger, onLog, setLogUserId, type Level, type LogEntry } from "../utils/logger"

const Pre = ({ children }: { children: React.ReactNode }) => (
  <pre className="max-h-64 overflow-auto rounded-lg bg-md-surface-container-high p-3 text-xs">{children}</pre>
)

const json = (value: unknown) => JSON.stringify(value, null, 2)

function Field({ children, id, label }: { children: React.ReactNode; id: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

type AnalyticsCall = { name: string; payload?: unknown }

export function UtilSections() {
  // logger
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [logCode, setLogCode] = useState("DEMO-CODE: Something happened")
  const [logLevel, setLogLevel] = useState<Level>("info")
  const [logDetails, setLogDetails] = useState("extra details")
  const [logUser, setLogUser] = useState("ada")

  // analytics
  const [calls, setCalls] = useState<AnalyticsCall[]>([])
  const [failing, setFailing] = useState(false)
  const [eventName, setEventName] = useState<EventName>(Events.SIGNUP)
  const [props, setProps] = useState('{"plan":"pro"}')
  const [analyticsUser, setAnalyticsUser] = useState("ada")

  // errorCodes
  const [statusText, setStatusText] = useState("404")

  // http
  const [url, setUrl] = useState("/demo/connections.json")
  const [response, setResponse] = useState("")
  const [sending, setSending] = useState(false)

  // cache
  const [cacheKey, setCacheKey] = useState<CacheKey>(CacheKeys.orgId)
  const [cacheValue, setCacheValue] = useState('{"a":1}')
  const [cacheResult, setCacheResult] = useState("")
  const [, setTick] = useState(0)

  useEffect(() => onLog((entry) => setEntries((prev) => [entry, ...prev].slice(0, 4))), [])

  useEffect(() => {
    const record = (name: string, payload?: unknown) => setCalls((prev) => [{ name, payload }, ...prev].slice(0, 6))
    const recorder: AnalyticsAdapter = {
      identify: (args) => record("identify", args),
      init: () => record("init"),
      pageView: () => record("pageView"),
      reset: () => record("reset"),
      track: (name, properties) => record(`track ${name}`, properties),
    }
    const down = () => { throw new Error("provider down") }
    const broken: AnalyticsAdapter = { identify: down, init: down, pageView: down, reset: down, track: down }
    configureAnalytics({ adapters: failing ? [broken, recorder] : [recorder], enabled: true })
    return () => configureAnalytics({ adapters: [] })
  }, [failing])

  const status = Number(statusText)
  const codeRows = Object.entries(ErrorCodes).flatMap(([group, codes]) =>
    Object.entries(codes).map(([key, value]) => ({ group, key, value }))
  )

  let parsedProps: Record<string, unknown> | undefined
  let propsError = false
  try { parsedProps = props.trim() ? JSON.parse(props) : undefined }
  catch { propsError = true }

  async function send() {
    setSending(true)
    try { setResponse(json(await http.get(url))) }
    catch (error) {
      setResponse(isApiError(error) ? json({ code: error.code, message: error.message, name: error.name, status: error.status }) : String(error))
    }
    finally { setSending(false) }
  }

  const cacheAction = (run: () => unknown) => {
    const result = run()
    setCacheResult(result === undefined ? "ok" : json(result))
    setTick((t) => t + 1)
  }

  return (
    <>
      <Section name="logger" title="logger">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_9rem_1fr_auto]">
          <Field id="lg-code" label="Error code"><Input id="lg-code" value={logCode} onChange={(e) => setLogCode(e.target.value)} /></Field>
          <Field id="lg-level" label="Level">
            <Select value={logLevel} onValueChange={(v) => setLogLevel(v as Level)}>
              <SelectTrigger id="lg-level"><SelectValue /></SelectTrigger>
              <SelectContent>{(["info", "warn", "error"] as const).map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="lg-details" label="Details"><Input id="lg-details" value={logDetails} onChange={(e) => setLogDetails(e.target.value)} /></Field>
          <Button onClick={() => Logger[logLevel](logCode, logDetails)}>Log</Button>
        </div>
        <Row label="Attribute logs to a user">
          <Input aria-label="User id" className="w-40" value={logUser} onChange={(e) => setLogUser(e.target.value)} />
          <Button variant="outline" onClick={() => setLogUserId(logUser)}>setLogUserId</Button>
        </Row>
        <Typography variant="caption" tone="muted">Entries below come from onLog(); the same entry is also written to the browser console.</Typography>
        <Pre>{entries.length ? json(entries) : "No entries yet. Press Log."}</Pre>
      </Section>

      <Section name="analytics" title="analytics">
        <Row label="The facade below talks to a recording adapter registered with configureAnalytics">
          <Label><Switch checked={failing} onCheckedChange={setFailing} /> Also register a broken provider (isolated; see logger)</Label>
        </Row>
        <div className="grid items-end gap-4 sm:grid-cols-[10rem_1fr_auto]">
          <Field id="an-event" label="Event">
            <Select value={eventName} onValueChange={(v) => setEventName(v as EventName)}>
              <SelectTrigger id="an-event"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.values(Events).map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="an-props" label="Properties (JSON)"><Input id="an-props" aria-invalid={propsError} value={props} onChange={(e) => setProps(e.target.value)} /></Field>
          <Button disabled={propsError} onClick={() => trackEvents(eventName, parsedProps)}>trackEvents</Button>
        </div>
        <Row label="Other calls">
          <Button variant="outline" onClick={init}>init</Button>
          <Button variant="outline" onClick={trackPageView}>trackPageView</Button>
          <Input aria-label="User id" className="w-32" value={analyticsUser} onChange={(e) => setAnalyticsUser(e.target.value)} />
          <Button variant="outline" onClick={() => identifyUser({ set: { plan: "pro" }, userId: analyticsUser })}>identifyUser</Button>
          <Button variant="outline" onClick={reset}>reset</Button>
        </Row>
        <Pre>{calls.length ? json(calls) : "No calls recorded yet."}</Pre>
      </Section>

      <Section name="errorCodes" title="errorCodes">
        <Row label="Map an HTTP status to a code (0 = no response)">
          <Input aria-label="HTTP status" className="w-28" inputMode="numeric" value={statusText} onChange={(e) => setStatusText(e.target.value)} />
          {Number.isFinite(status) && (
            <>
              <Badge variant="secondary">{errorCodeFromStatus(status)}</Badge>
              <Typography variant="caption" tone="muted">{`new ApiError(${status}) → status ${new ApiError(status).status}, code "${new ApiError(status).code}"`}</Typography>
            </>
          )}
        </Row>
        <Table>
          <TableHeader><TableRow><TableHead>Group</TableHead><TableHead>Key</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
          <TableBody>{codeRows.map((r) => <TableRow key={`${r.group}.${r.key}`}><TableCell>{r.group}</TableCell><TableCell>{r.key}</TableCell><TableCell>{r.value}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Section>

      <Section name="http" title="http">
        <Row label="Presets">
          <Button variant="outline" size="sm" onClick={() => setUrl("/demo/connections.json")}>Success</Button>
          <Button variant="outline" size="sm" onClick={() => setUrl("/demo/empty.json")}>Empty list</Button>
          <Button variant="outline" size="sm" onClick={() => setUrl("http://localhost:1/x")}>Network failure</Button>
        </Row>
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
          <Field id="ht-url" label="GET URL"><Input id="ht-url" value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
          <Button disabled={sending} onClick={send}>{sending ? "Sending…" : "Send"}</Button>
        </div>
        <Typography variant="caption" tone="muted">Sends X-Request-ID, X-Session-ID and, if you saved one in the cache section under “token”, a bearer token. Failures throw ApiError.</Typography>
        <Pre>{response || "No response yet."}</Pre>
      </Section>

      <Section name="apiUrls" title="apiUrls">
        <Table>
          <TableBody>
            <TableRow><TableCell>VITE_API_HOST</TableCell><TableCell>{import.meta.env.VITE_API_HOST ?? "(unset, so same origin)"}</TableCell></TableRow>
            <TableRow><TableCell>baseUrl</TableCell><TableCell>{baseUrl}</TableCell></TableRow>
            <TableRow><TableCell>apiUrls.status</TableCell><TableCell>{apiUrls.status}</TableCell></TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section name="cache" title="cache">
        <div className="grid items-end gap-4 sm:grid-cols-[12rem_1fr]">
          <Field id="ca-key" label="Key">
            <Select value={cacheKey} onValueChange={(v) => setCacheKey(v as CacheKey)}>
              <SelectTrigger id="ca-key"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.values(CacheKeys).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="ca-val" label="Value"><Input id="ca-val" value={cacheValue} onChange={(e) => setCacheValue(e.target.value)} /></Field>
        </div>
        <Row label="Strings / JSON / remove">
          <Button onClick={() => cacheAction(() => save(cacheKey, cacheValue))}>save</Button>
          <Button variant="secondary" onClick={() => cacheAction(() => retrieve(cacheKey))}>retrieve</Button>
          <Button onClick={() => cacheAction(() => { try { saveJson(cacheKey, JSON.parse(cacheValue)) } catch { return "Value is not valid JSON" } })}>saveJson</Button>
          <Button variant="secondary" onClick={() => cacheAction(() => retrieveJson(cacheKey))}>retrieveJson</Button>
          <Button variant="destructive" onClick={() => cacheAction(() => remove(cacheKey))}>remove</Button>
        </Row>
        <Pre>{cacheResult || "Result appears here."}</Pre>
        <Table>
          <TableHeader><TableRow><TableHead>Key</TableHead><TableHead>Stored value</TableHead></TableRow></TableHeader>
          <TableBody>{Object.values(CacheKeys).map((k) => <TableRow key={k}><TableCell>{k}</TableCell><TableCell>{retrieve(k) ?? "(empty)"}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Section>

      <Section name="constants" title="constants">
        <Typography tone="muted">CacheKeys: every localStorage key the boilerplate uses, defined once.</Typography>
        <Table>
          <TableHeader><TableRow><TableHead>CacheKeys.</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
          <TableBody>{Object.entries(CacheKeys).map(([k, v]) => <TableRow key={k}><TableCell>{k}</TableCell><TableCell>{v}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Section>
    </>
  )
}
