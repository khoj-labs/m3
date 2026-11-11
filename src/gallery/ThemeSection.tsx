import { useEffect } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"
import { Row, Section } from "./Section"

/**
 * Preview-only: injects a theme file after src/theme.css so it overrides it.
 * With nothing selected, the page shows src/theme.css exactly as it is.
 * Every file in src/themes appears here automatically (no code change needed).
 */
const files = import.meta.glob<string>("../themes/*.css", { eager: true, import: "default", query: "?inline" })
const themes: Record<string, string> = Object.fromEntries(
  Object.entries(files)
    .map(([path, css]) => [path.split("/").pop()!.replace(/\.css$/, ""), css] as const)
    .sort(([a], [b]) => a.localeCompare(b))
)
type ThemeName = string

/** Lives in the page (not the section) so the preview survives switching tabs. */
export function useThemePreview(name: ThemeName) {
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

export function ThemeSection({ theme, onThemeChange }: { onThemeChange: (name: ThemeName) => void; theme: ThemeName }) {
  return (
    <Section name="theme" title="Preview">
      <Row label="Preview a theme across every component below">
        <ToggleGroup type="single" variant="outline" value={theme} onValueChange={onThemeChange}>
          {Object.keys(themes).map((name) => <ToggleGroupItem key={name} value={name}>{name}</ToggleGroupItem>)}
        </ToggleGroup>
      </Row>
      <Row label="Color roles" className="gap-4">
        {swatches.map(({ className, label }) => (
          <div key={label} className="flex w-24 flex-col items-center gap-1.5 self-start text-center">
            <span className={`h-12 w-full rounded-lg border border-md-outline-variant ${className}`} />
            <Typography variant="caption" tone="muted" className="h-8">{label}</Typography>
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
