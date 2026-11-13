import { ArrowUpIcon, BoxesIcon, LayoutDashboardIcon, PuzzleIcon, WrenchIcon, type LucideIcon } from "lucide-react"
import { lazy, Suspense, useEffect, useState } from "react"
import AppAlerts from "@/boilerplate/common/AppAlerts"
import Spinner from "@/boilerplate/common/Spinner"
import { ComponentsGroup } from "@/boilerplate/gallery/ComponentSections"
import { UtilsGroup } from "@/boilerplate/gallery/UtilSections"
import { AppBar, AppBarActions, AppBarLeading, AppBarTitle } from "@/components/ui/app-bar"
import { BottomNavigation, BottomNavigationItem } from "@/components/ui/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Fab } from "@/components/ui/fab"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { DisplaySections } from "./DisplaySections"
import { FormSections } from "./FormSections"
import { GalleryNav } from "./GalleryNav"
import { OverlaySections } from "./OverlaySections"
import { ThemeSection, useThemePreview } from "./ThemeSection"
import { useScrollY } from "./useScrollY"

// Lazy: the page components pull in the full lucide icon map for the PageHeader playground.
const PageComponentsGroup = lazy(() => import("@/boilerplate/gallery/PageSections").then((m) => ({ default: m.PageComponentsGroup })))

type Tab = {
  description: string
  Icon: LucideIcon
  label: string
  value: string
}

const tabs: Tab[] = [
  { description: "Every component in src/components/ui, plus the boilerplate building blocks, in all variants and states.", Icon: PuzzleIcon, label: "Components", value: "components" },
  { description: "Boilerplate page-level pieces: layout chrome, headers, states and route guards.", Icon: LayoutDashboardIcon, label: "Page components", value: "page-components" },
  { description: "Boilerplate non-visual helpers: logging, analytics, errors, http and storage.", Icon: WrenchIcon, label: "Utils", value: "utils" },
]

const repoUrl = "https://github.com/khoj-labs/m3"

/** GitHub mark (lucide no longer ships brand icons). */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

/** The active tab lives in the URL hash (#components | #page-components | #utils). */
const tabFromHash = () => tabs.find((t) => t.value === window.location.hash.slice(1))?.value ?? tabs[0].value

export default function Gallery() {
  const [tab, setTab] = useState(tabFromHash)
  const [theme, setTheme] = useState("")
  const y = useScrollY()
  useThemePreview(theme)

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1)
      if (tabs.some((t) => t.value === hash)) setTab(hash)
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
          <AppBarLeading className="gap-3">
            <a href="https://khojlabs.com" target="_blank" rel="noreferrer" aria-label="Khoj Labs" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <img src={`${import.meta.env.BASE_URL}khojlabs.png`} alt="" className="size-10 rounded-lg" />
            </a>
            <Separator orientation="vertical" className="min-h-full" />
            <span aria-hidden className="grid size-10 place-items-center rounded-full bg-md-primary-container text-md-on-primary-container">
              <BoxesIcon className="size-5" />
            </span>
          </AppBarLeading>
          <AppBarTitle>M3</AppBarTitle>
          <AppBarActions>
            <Typography variant="caption" tone="muted">v {__APP_VERSION__}</Typography>
            <Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="m3 on GitHub" nativeButton={false} render={<a href={repoUrl} target="_blank" rel="noreferrer" />}>
              <GithubIcon />
            </Button>
          </AppBarActions>
        </AppBar>

        <div className="mx-auto max-w-6xl px-4 pt-4 pb-28 md:pb-12">
          <Tabs value={tab} onValueChange={select}>
            <TabsList variant="line" className="hidden md:inline-flex">
              {tabs.map(({ Icon, label, value }) => (
                <TabsTrigger key={value} value={value}><Icon />{label}</TabsTrigger>
              ))}
            </TabsList>

            {tabs.map(({ description, value }) => (
              <TabsContent key={value} value={value} className="mt-4">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
                  <aside className="hidden lg:block">
                    <div className="sticky top-20"><GalleryNav tab={tab} /></div>
                  </aside>
                  <main className="min-w-0">
                    <Typography tone="muted">{description}</Typography>
                    {value === "components" && (
                      <>
                        <div data-group="Theme"><ThemeSection theme={theme} onThemeChange={setTheme} /></div>
                        <div data-group="Inputs"><FormSections /></div>
                        <div data-group="Display"><DisplaySections /></div>
                        <div data-group="Overlays"><OverlaySections /></div>
                        <div data-group="Boilerplate"><ComponentsGroup /></div>
                      </>
                    )}
                    {value === "page-components" && (
                      <div data-group="Page components">
                        <Suspense fallback={<Spinner />}><PageComponentsGroup /></Suspense>
                      </div>
                    )}
                    {value === "utils" && <div data-group="Utils"><UtilsGroup /></div>}
                  </main>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <BottomNavigation className="md:hidden" position="fixed" value={tab} onValueChange={select}>
          {tabs.map(({ Icon, label, value }) => (
            <BottomNavigationItem key={value} value={value} icon={<Icon />} label={label} />
          ))}
        </BottomNavigation>

        {y > 400 && (
          <Fab size="sm" variant="secondary" aria-label="Back to top" className="fixed right-4 bottom-24 z-40 md:bottom-6" onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}>
            <ArrowUpIcon />
          </Fab>
        )}
      </TooltipProvider>
      <Toaster />
    </AppAlerts>
  )
}
