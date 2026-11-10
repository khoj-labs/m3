import { Link } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { DisplaySections } from "./DisplaySections"
import { FormSections } from "./FormSections"
import { OverlaySections } from "./OverlaySections"
import { ThemeSection } from "./ThemeSection"

export default function Gallery() {
  return (
    <TooltipProvider>
      <div className="mx-auto max-w-5xl px-4 pb-24">
        <header className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <div className="flex items-baseline gap-4">
            <Typography variant="title">Component gallery</Typography>
            <Link to="/boilerplate" className="text-sm text-primary underline-offset-4 hover:underline">Boilerplate gallery →</Link>
          </div>
        </header>
        <ThemeSection />
        <FormSections />
        <DisplaySections />
        <OverlaySections />
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
