import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import violet from "@/themes/violet.css?inline"
import ocean from "@/themes/ocean.css?inline"
import { FormSections } from "./FormSections"
import { DisplaySections } from "./DisplaySections"
import { OverlaySections } from "./OverlaySections"

/**
 * Preview-only: injects a theme file after src/theme.css so it overrides it.
 * In a real project you swap by replacing src/theme.css (npm run theme -- ocean).
 */
const themes = { default: "", violet, ocean } as const
type ThemeName = keyof typeof themes

function useThemePreview(name: ThemeName) {
  useEffect(() => {
    const id = "theme-preview"
    document.getElementById(id)?.remove()
    if (!themes[name]) return
    const el = document.createElement("style")
    el.id = id
    el.textContent = themes[name]
    document.head.appendChild(el)
    return () => el.remove()
  }, [name])
}

export default function Gallery() {
  const [theme, setTheme] = useState<ThemeName>("default")
  useThemePreview(theme)
  return (
    <TooltipProvider>
      <div className="mx-auto max-w-5xl px-4 pb-24">
        <header className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <Typography variant="title">Component gallery</Typography>
          <div className="flex items-center gap-2">
            <Typography variant="caption" tone="muted">Theme preview</Typography>
            <ToggleGroup type="single" variant="outline" size="sm" value={theme} onValueChange={(v) => v && setTheme(v as ThemeName)}>
              <ToggleGroupItem value="default">theme.css</ToggleGroupItem>
              <ToggleGroupItem value="violet">violet</ToggleGroupItem>
              <ToggleGroupItem value="ocean">ocean</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>
        <FormSections />
        <DisplaySections />
        <OverlaySections />
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
