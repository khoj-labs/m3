import { ArrowLeftIcon, ArrowUpIcon, BoxesIcon, LayoutDashboardIcon, PuzzleIcon, WrenchIcon, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppBar, AppBarActions, AppBarLeading, AppBarTitle } from "@/components/ui/app-bar"
import { BottomNavigation, BottomNavigationItem } from "@/components/ui/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Fab } from "@/components/ui/fab"
import { List, ListItem, ListItemText, ListSubheader } from "@/components/ui/list"
import { Paper } from "@/components/ui/paper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import AppAlerts from "../common/AppAlerts"
import { ComponentsGroup } from "./ComponentSections"
import { PageComponentsGroup } from "./PageSections"
import { UtilsGroup } from "./UtilSections"

type Group = {
  description: string
  Icon: LucideIcon
  label: string
  Panel: () => React.JSX.Element
  value: string
}

const groups: Group[] = [
  { description: "Small building blocks you can drop into any page.", Icon: PuzzleIcon, label: "Components", Panel: ComponentsGroup, value: "components" },
  { description: "Page-level pieces: layout chrome, headers, states and route guards.", Icon: LayoutDashboardIcon, label: "Page components", Panel: PageComponentsGroup, value: "page-components" },
  { description: "Non-visual helpers: logging, analytics, errors, http and storage.", Icon: WrenchIcon, label: "Utils", Panel: UtilsGroup, value: "utils" },
]

/** The active group lives in the URL hash (#components | #page-components | #utils). */
const groupFromHash = () => groups.find((g) => g.value === window.location.hash.slice(1))?.value ?? groups[0].value

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return y
}

type IndexItem = { id: string; title: string }

/** "On this page": built from the sections actually rendered, so it can never drift. */
function PageIndex({ tab }: { tab: string }) {
  const [items, setItems] = useState<IndexItem[]>([])
  const [active, setActive] = useState("")

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-gallery]")]
    setItems(sections.map((s) => ({ id: s.id, title: s.querySelector("[data-slot=typography]")?.textContent ?? s.id })))
    setActive(sections[0]?.id ?? "")
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActive(top.target.id)
      },
      { rootMargin: "-96px 0px -65% 0px" }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [tab])

  return (
    <Paper variant="filled" elevation={0} className="p-2">
      <List dense>
        <ListSubheader>On this page</ListSubheader>
        {items.map(({ id, title }) => (
          <ListItem key={id} asChild selected={active === id}>
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) }}>
              <ListItemText primary={title} className="[&>span]:text-sm" />
            </a>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default function BoilerplateGallery() {
  const [tab, setTab] = useState(groupFromHash)
  const y = useScrollY()

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1)
      if (groups.some((g) => g.value === hash)) setTab(hash)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  function select(value: string) {
    setTab(value)
    window.history.replaceState(null, "", `#${value}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <AppAlerts>
      <TooltipProvider>
        <AppBar position="sticky" color="container" elevated={y > 8}>
          <AppBarLeading>
            <span aria-hidden className="grid size-10 place-items-center rounded-full bg-md-primary-container text-md-on-primary-container"><BoxesIcon className="size-5" /></span>
          </AppBarLeading>
          <AppBarTitle>Boilerplate</AppBarTitle>
          <AppBarActions>
            <Button variant="ghost" asChild><Link to="/gallery"><ArrowLeftIcon data-icon="inline-start" />Component gallery</Link></Button>
          </AppBarActions>
        </AppBar>

        <div className="mx-auto max-w-6xl px-4 pt-4 pb-28 md:pb-12">
          <Tabs value={tab} onValueChange={select}>
            <TabsList variant="line" className="hidden md:inline-flex">
              {groups.map(({ Icon, label, value }) => (
                <TabsTrigger key={value} value={value}><Icon />{label}</TabsTrigger>
              ))}
            </TabsList>

            {groups.map(({ description, label, Panel, value }) => (
              <TabsContent key={value} value={value} className="mt-4">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
                  <Paper variant="outlined" elevation={0} shape="large" className="min-w-0 p-4 sm:p-6">
                    <Typography as="h2" variant="headline">{label}</Typography>
                    <Typography tone="muted" className="mt-1">{description}</Typography>
                    <Panel />
                  </Paper>
                  <aside className="hidden lg:block">
                    <div className="sticky top-24"><PageIndex tab={tab} /></div>
                  </aside>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <BottomNavigation className="md:hidden" position="fixed" value={tab} onValueChange={select}>
          {groups.map(({ Icon, label, value }) => (
            <BottomNavigationItem key={value} value={value} icon={<Icon />} label={label} />
          ))}
        </BottomNavigation>

        {y > 400 && (
          <Fab size="sm" variant="secondary" aria-label="Back to top" className="fixed right-4 bottom-24 z-40 md:bottom-6" onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}>
            <ArrowUpIcon />
          </Fab>
        )}
      </TooltipProvider>
    </AppAlerts>
  )
}
