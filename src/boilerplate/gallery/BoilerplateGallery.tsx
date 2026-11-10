import { Link } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import AppAlerts from "../common/AppAlerts"
import { ComponentsGroup } from "./ComponentSections"
import { PageComponentsGroup } from "./PageSections"
import { UtilsGroup } from "./UtilSections"

export default function BoilerplateGallery() {
  return (
    <AppAlerts>
      <TooltipProvider>
        <div className="mx-auto max-w-5xl px-4 pb-24">
          <header className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
            <Typography variant="title">Boilerplate gallery</Typography>
            <nav aria-label="Sections" className="flex flex-wrap items-center gap-4 text-sm">
              <a href="#components" className="hover:underline">1 Components</a>
              <a href="#page-components" className="hover:underline">2 Page components</a>
              <a href="#utils" className="hover:underline">3 Utils</a>
              <Link to="/gallery" className="text-primary underline-offset-4 hover:underline">← Component gallery</Link>
            </nav>
          </header>
          <ComponentsGroup />
          <PageComponentsGroup />
          <UtilsGroup />
        </div>
      </TooltipProvider>
    </AppAlerts>
  )
}
