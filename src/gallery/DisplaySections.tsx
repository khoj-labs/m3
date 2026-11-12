import { ArrowLeftIcon, BellIcon, FolderIcon, HeartIcon, HouseIcon, InboxIcon, InfoIcon, MenuIcon, MoreVerticalIcon, SearchIcon, SettingsIcon, StarIcon, TriangleAlertIcon, UserIcon, ChevronsUpDownIcon } from "lucide-react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AppBar, AppBarActions, AppBarLeading, AppBarTitle } from "@/components/ui/app-bar"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation, BottomNavigationItem } from "@/components/ui/bottom-navigation"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { List, ListDivider, ListItem, ListItemIcon, ListItemText, ListItemTrailing, ListSubheader } from "@/components/ui/list"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Paper } from "@/components/ui/paper"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Stepper } from "@/components/ui/stepper"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { Section, Row } from "./Section"

const steps = [
  { label: "Account", description: "Create credentials", content: "Pick a username and password." },
  { label: "Profile", optional: true, content: "Tell us about yourself." },
  { label: "Review", content: "Check everything and submit." },
]

export function DisplaySections() {
  const [nav, setNav] = useState("home")
  const [step, setStep] = useState(1)
  const [page, setPage] = useState(2)
  const [open, setOpen] = useState(false)
  return (
    <>
      <Section name="typography" title="Typography">
        <Row label="Variants" className="flex-col items-start gap-2">
          {(["display", "headline", "title", "subtitle", "body-lg", "body", "label", "caption", "code"] as const).map((v) => (
            <Typography key={v} variant={v}>{v} — The quick brown fox</Typography>
          ))}
        </Row>
        <Row label="Tones / alignment / noWrap">
          <Typography tone="muted">muted</Typography>
          <Typography tone="primary">primary</Typography>
          <Typography tone="destructive">destructive</Typography>
          <Typography align="center" className="w-40 border border-dashed">center</Typography>
          <Typography noWrap className="w-32">This long text is truncated with an ellipsis</Typography>
        </Row>
      </Section>

      <Section name="paper" title="Paper">
        <Row label="Elevation 0–3 / outlined / filled / shapes">
          {([0, 1, 2, 3] as const).map((e) => <Paper key={e} elevation={e} className="grid size-24 place-items-center text-sm">elev {e}</Paper>)}
          <Paper variant="outlined" className="grid size-24 place-items-center text-sm">outlined</Paper>
          <Paper variant="filled" className="grid size-24 place-items-center text-sm">filled</Paper>
          <Paper shape="square" className="grid size-24 place-items-center text-sm">square</Paper>
          <Paper shape="large" className="grid size-24 place-items-center text-sm">large</Paper>
        </Row>
      </Section>

      <Section name="avatar" title="Avatar">
        <Row label="Sizes / fallback / image / badge / group">
          <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
          <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
          <Avatar><AvatarFallback><UserIcon className="size-4" /></AvatarFallback><AvatarBadge /></Avatar>
          <AvatarGroup>
            <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </Row>
      </Section>

      <Section name="badge" title="Badge">
        <Row label="Variants">
          {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
          <Badge><StarIcon data-icon="inline-start" />With icon</Badge>
        </Row>
      </Section>

      <Section name="separator" title="Separator">
        <Row label="Horizontal / vertical">
          <div className="w-48"><Separator /></div>
          <div className="flex h-6 items-center gap-3 text-sm">One<Separator orientation="vertical" />Two<Separator orientation="vertical" />Three</div>
        </Row>
      </Section>

      <Section name="table" title="Table">
        <Table>
          <TableCaption>Recent invoices</TableCaption>
          <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow><TableCell>INV001</TableCell><TableCell><Badge variant="secondary">Paid</Badge></TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
            <TableRow data-state="selected"><TableCell>INV002</TableCell><TableCell><Badge variant="outline">Pending</Badge></TableCell><TableCell className="text-right">$150.00</TableCell></TableRow>
            <TableRow><TableCell>INV003</TableCell><TableCell><Badge variant="destructive">Failed</Badge></TableCell><TableCell className="text-right">$350.00</TableCell></TableRow>
          </TableBody>
          <TableFooter><TableRow><TableCell colSpan={2}>Total</TableCell><TableCell className="text-right">$750.00</TableCell></TableRow></TableFooter>
        </Table>
      </Section>

      <Section name="alert" title="Alert">
        <Alert><InfoIcon /><AlertTitle>Heads up</AlertTitle><AlertDescription>Default alert with an icon.</AlertDescription></Alert>
        <Alert variant="destructive"><TriangleAlertIcon /><AlertTitle>Error</AlertTitle><AlertDescription>Destructive alert.</AlertDescription></Alert>
        <Alert><AlertTitle>No icon, title only</AlertTitle></Alert>
      </Section>

      <Section name="progress" title="Progress">
        <Row label="0 / 35 / 70 / 100" className="flex-col items-stretch">
          {[0, 35, 70, 100].map((v) => <Progress key={v} value={v} />)}
        </Row>
      </Section>

      <Section name="skeleton" title="Skeleton">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-2"><Skeleton className="h-4 w-56" /><Skeleton className="h-4 w-40" /></div>
        </div>
      </Section>

      <Section name="accordion" title="Accordion">
        <Accordion type="single" collapsible defaultValue="a" className="max-w-md">
          <AccordionItem value="a"><AccordionTrigger>Open by default</AccordionTrigger><AccordionContent>Content A.</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Collapsed</AccordionTrigger><AccordionContent>Content B.</AccordionContent></AccordionItem>
          <AccordionItem value="c" disabled><AccordionTrigger>Disabled</AccordionTrigger><AccordionContent>Content C.</AccordionContent></AccordionItem>
        </Accordion>
        <Accordion type="multiple" defaultValue={["x", "y"]} className="max-w-md">
          <AccordionItem value="x"><AccordionTrigger>Multiple open 1</AccordionTrigger><AccordionContent>X</AccordionContent></AccordionItem>
          <AccordionItem value="y"><AccordionTrigger>Multiple open 2</AccordionTrigger><AccordionContent>Y</AccordionContent></AccordionItem>
        </Accordion>
      </Section>

      <Section name="card" title="Card">
        <Row label="Default / small / with action / with image placeholder" className="items-start">
          <Card className="w-64">
            <CardHeader><CardTitle>Card title</CardTitle><CardDescription>Card description</CardDescription></CardHeader>
            <CardContent>Content goes here.</CardContent>
            <CardFooter className="gap-2"><Button size="sm">Save</Button><Button size="sm" variant="ghost">Cancel</Button></CardFooter>
          </Card>
          <Card size="sm" className="w-64">
            <CardHeader><CardTitle>Small card</CardTitle><CardAction><Button size="icon-sm" variant="ghost" aria-label="more"><MoreVerticalIcon /></Button></CardAction></CardHeader>
            <CardContent>Compact spacing.</CardContent>
          </Card>
          <Card className="w-64"><div className="h-24 bg-md-primary-container" /><CardHeader><CardTitle>Media</CardTitle></CardHeader></Card>
        </Row>
      </Section>

      <Section name="breadcrumb" title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem><BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section name="pagination" title="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#pagination" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }} /></PaginationItem>
            {[1, 2, 3].map((n) => <PaginationItem key={n}><PaginationLink href="#pagination" isActive={n === page} onClick={(e) => { e.preventDefault(); setPage(n) }}>{n}</PaginationLink></PaginationItem>)}
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#pagination" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(3, p + 1)) }} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>

      <Section name="tabs" title="Tabs">
        <Row label="Default / line / vertical" className="items-start gap-8">
          <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">Account</TabsTrigger><TabsTrigger value="b">Password</TabsTrigger><TabsTrigger value="c" disabled>Disabled</TabsTrigger></TabsList><TabsContent value="a">Account panel</TabsContent><TabsContent value="b">Password panel</TabsContent></Tabs>
          <Tabs defaultValue="a"><TabsList variant="line"><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b">Analytics</TabsTrigger></TabsList><TabsContent value="a">Overview panel</TabsContent><TabsContent value="b">Analytics panel</TabsContent></Tabs>
          <Tabs defaultValue="a" orientation="vertical"><TabsList><TabsTrigger value="a">One</TabsTrigger><TabsTrigger value="b">Two</TabsTrigger></TabsList><TabsContent value="a">First</TabsContent><TabsContent value="b">Second</TabsContent></Tabs>
        </Row>
      </Section>

      <Section name="collapsible" title="Collapsible">
        <Collapsible open={open} onOpenChange={setOpen} className="w-72 space-y-2">
          <div className="flex items-center justify-between"><span className="text-sm font-medium">3 starred repos</span><CollapsibleTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="toggle"><ChevronsUpDownIcon /></Button></CollapsibleTrigger></div>
          <div className="rounded-lg border px-3 py-2 text-sm">repo/one</div>
          <CollapsibleContent className="space-y-2"><div className="rounded-lg border px-3 py-2 text-sm">repo/two</div><div className="rounded-lg border px-3 py-2 text-sm">repo/three</div></CollapsibleContent>
        </Collapsible>
      </Section>

      <Section name="list" title="List">
        <Paper variant="outlined" className="w-80">
          <List>
            <ListSubheader>Mail</ListSubheader>
            <ListItem render={<button />} selected><ListItemIcon><InboxIcon /></ListItemIcon><ListItemText primary="Inbox" secondary="Selected" /><ListItemTrailing>24</ListItemTrailing></ListItem>
            <ListItem render={<button />}><ListItemIcon><FolderIcon /></ListItemIcon><ListItemText primary="Archive" secondary="Interactive" /></ListItem>
            <ListItem><ListItemIcon><HeartIcon /></ListItemIcon><ListItemText primary="Static item" secondary="Not interactive" /></ListItem>
            <ListItem render={<button />} disabled><ListItemIcon><BellIcon /></ListItemIcon><ListItemText primary="Disabled" /></ListItem>
            <ListDivider />
            <ListItem render={<button />}><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary="Settings" /></ListItem>
          </List>
        </Paper>
      </Section>

      <Section name="app-bar" title="App Bar">
        {(["small", "center-aligned", "medium", "large"] as const).map((v) => (
          <div key={v} className="overflow-hidden rounded-xl border border-border">
            <AppBar variant={v} color={v === "large" ? "container" : "surface"}>
              <AppBarLeading><Button variant="ghost" size="icon" aria-label="menu">{v === "center-aligned" ? <MenuIcon /> : <ArrowLeftIcon />}</Button></AppBarLeading>
              <AppBarTitle>{v}</AppBarTitle>
              <AppBarActions><Button variant="ghost" size="icon" aria-label="search"><SearchIcon /></Button><Button variant="ghost" size="icon" aria-label="more"><MoreVerticalIcon /></Button></AppBarActions>
            </AppBar>
          </div>
        ))}
        <div className="overflow-hidden rounded-xl"><AppBar color="primary" elevated><AppBarTitle>Primary, elevated</AppBarTitle></AppBar></div>
      </Section>

      <Section name="bottom-navigation" title="Bottom Navigation">
        <div className="max-w-md overflow-hidden rounded-xl border border-border">
          <BottomNavigation value={nav} onValueChange={setNav}>
            <BottomNavigationItem value="home" icon={<HouseIcon />} label="Home" />
            <BottomNavigationItem value="search" icon={<SearchIcon />} label="Search" badge={3} />
            <BottomNavigationItem value="inbox" icon={<InboxIcon />} label="Inbox" />
            <BottomNavigationItem value="off" icon={<SettingsIcon />} label="Disabled" disabled />
          </BottomNavigation>
        </div>
        <div className="max-w-md overflow-hidden rounded-xl border border-border">
          <BottomNavigation defaultValue="a">
            <BottomNavigationItem value="a" icon={<HouseIcon />} label="Home" showLabel={false} />
            <BottomNavigationItem value="b" icon={<SearchIcon />} label="Search" showLabel={false} />
            <BottomNavigationItem value="c" icon={<UserIcon />} label="Profile" showLabel={false} />
          </BottomNavigation>
        </div>
      </Section>

      <Section name="stepper" title="Stepper">
        <Stepper steps={steps} activeStep={step} onStepClick={setStep} />
        <Row label="Vertical with content / error state / all complete" className="items-start gap-12">
          <Stepper steps={steps} activeStep={step} orientation="vertical" className="w-64" />
          <Stepper steps={[{ label: "Done" }, { label: "Failed", error: true }, { label: "Later" }]} activeStep={1} orientation="vertical" />
          <Stepper steps={[{ label: "A" }, { label: "B" }, { label: "C" }]} activeStep={3} />
        </Row>
        <Row label="Controls"><Button size="sm" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button><Button size="sm" onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</Button></Row>
      </Section>
    </>
  )
}
