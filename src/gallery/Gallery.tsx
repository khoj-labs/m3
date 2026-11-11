import { ArrowRightIcon, ComponentIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { AppBar, AppBarActions, AppBarLeading, AppBarTitle } from "@/components/ui/app-bar"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DisplaySections } from "./DisplaySections"
import { FormSections } from "./FormSections"
import { GalleryNav } from "./GalleryNav"
import { OverlaySections } from "./OverlaySections"
import { ThemeSection } from "./ThemeSection"
import { useScrollY } from "./useScrollY"

export default function Gallery() {
  const y = useScrollY()
  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <AppBar position="sticky" color="container" elevated={y > 8} className="-mx-4">
          <AppBarLeading>
            <span aria-hidden className="grid size-10 place-items-center rounded-full bg-md-primary-container text-md-on-primary-container"><ComponentIcon className="size-5" /></span>
          </AppBarLeading>
          <AppBarTitle>Component gallery</AppBarTitle>
          <AppBarActions>
            <Button variant="ghost" asChild><Link to="/boilerplate">Boilerplate gallery<ArrowRightIcon data-icon="inline-end" /></Link></Button>
          </AppBarActions>
        </AppBar>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 pt-4"><GalleryNav /></div>
          </aside>
          <main className="min-w-0">
            <div data-group="Theme"><ThemeSection /></div>
            <div data-group="Inputs"><FormSections /></div>
            <div data-group="Display"><DisplaySections /></div>
            <div data-group="Overlays"><OverlaySections /></div>
          </main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
