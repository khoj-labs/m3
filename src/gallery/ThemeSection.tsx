import { useEffect, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"
import ocean from "@/themes/ocean.css?inline"
import violet from "@/themes/violet.css?inline"
import { Row, Section } from "./Section"

/**
 * Preview-only: injects a theme file after src/theme.css so it overrides it.
 * With nothing selected, the page shows src/theme.css exactly as it is.
 */
const themes = { ocean, violet } as const
type ThemeName = keyof typeof themes

function useThemePreview(name: ThemeName | "") {
  useEffect(() => {
    const id = "theme-preview"
    document.getElementById(id)?.remove()
    if (!name) return
    const el = document.createElement("style")
    el.id = id
    el.textContent = themes[name]
    document.head.appendChild(el)
    return () => el.remove()
  }, [name])
}

// Full class names so Tailwind can see them.
const swatches = [
  { className: "bg-md-primary", label: "primary" },
  { className: "bg-md-primary-container", label: "primary container" },
  { className: "bg-md-secondary-container", label: "secondary container" },
  { className: "bg-md-tertiary-container", label: "tertiary container" },
  { className: "bg-md-error", label: "error" },
  { className: "bg-md-surface-container", label: "surface container" },
  { className: "bg-md-surface-container-highest", label: "surface container highest" },
  { className: "bg-md-outline", label: "outline" },
]

export function ThemeSection() {
  const [theme, setTheme] = useState<ThemeName | "">("")
  useThemePreview(theme)

  return (
    <Section name="theme" title="Theme preview">
      <Row label="Preview a theme across every component below">
        <ToggleGroup type="single" variant="outline" value={theme} onValueChange={(v) => setTheme(v as ThemeName | "")}>
          <ToggleGroupItem value="violet">violet</ToggleGroupItem>
          <ToggleGroupItem value="ocean">ocean</ToggleGroupItem>
        </ToggleGroup>
        <Typography variant="caption" tone="muted">Temporary. Click the selected theme again to go back to src/theme.css.</Typography>
      </Row>
      <Row label="Color roles" className="gap-4">
        {swatches.map(({ className, label }) => (
          <div key={label} className="flex w-24 flex-col items-center gap-1.5 text-center">
            <span className={`h-12 w-full rounded-lg border border-md-outline-variant ${className}`} />
            <Typography variant="caption" tone="muted">{label}</Typography>
          </div>
        ))}
      </Row>
      <Row label="Typeface and shape" className="gap-6">
        <Typography variant="display" className="leading-none">Aa</Typography>
        <Typography variant="headline">Heading font</Typography>
        <Typography>Body font</Typography>
        <span className="rounded-full bg-md-primary-container px-4 py-2 text-sm text-md-on-primary-container">Pill</span>
        <span className="rounded-xl bg-md-secondary-container px-4 py-2 text-sm text-md-on-secondary-container">Large radius</span>
      </Row>
    </Section>
  )
}
