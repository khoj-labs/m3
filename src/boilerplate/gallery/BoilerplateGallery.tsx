import { Link } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import AppAlerts from "../common/AppAlerts"
import { CommonSections } from "./CommonSections"
import { LayoutSections } from "./LayoutSections"
import { UtilSections } from "./UtilSections"

export default function BoilerplateGallery() {
  return (
    <AppAlerts>
      <TooltipProvider>
        <div className="mx-auto max-w-5xl px-4 pb-24">
          <header className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
            <Typography variant="title">Boilerplate gallery</Typography>
            <Link to="/gallery" className="text-sm text-primary underline-offset-4 hover:underline">← Component gallery</Link>
          </header>
          <CommonSections />
          <LayoutSections />
          <UtilSections />
        </div>
      </TooltipProvider>
    </AppAlerts>
  )
}
