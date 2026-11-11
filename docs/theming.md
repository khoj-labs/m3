# Theming m3

Everything visual comes from one CSS file. This page is the spec for it, written for people **and for AI assistants** that generate themes. If you are an assistant: read this page, follow the recipe, and finish by running `npm run check:theme`.

## How it works

- `src/theme.css` is the active theme. It is the only place that defines colors, radii, fonts, motion, elevation and layout sizes. Components never hard-code them.
- `src/themes/*.css` are alternative themes with the exact same structure (`violet.css` is the default, `ocean.css` is the second example). They are inactive until copied over `src/theme.css`.
- The file has three parts, in this order: light values in `:root`, dark values in `@media (prefers-color-scheme: dark) { :root { ... } }` (color roles only), then the shadcn token mapping in a second `:root` (the same in both modes).
- `src/index.css` turns the variables into Tailwind utilities (`bg-md-primary-container`, `shadow-elevation-2`, `ease-emphasized`, `rounded-xl`, ...). You never edit `index.css` to theme.
- Dark mode follows the system preference. There is no `.dark` class and no toggle.

## Create a theme

1. Copy `src/themes/violet.css` to `src/themes/<name>.css`.
2. Change the title in the header comment.
3. Set the five **seed hues** (`--hue-primary`, `--hue-secondary`, `--hue-tertiary`, `--hue-error`, `--hue-neutral`) to numbers from 0 to 360. Every color role is computed from them with fixed lightness and chroma, so light and dark mode both stay readable. Approximate oklch hues: red 25, orange 55, yellow 100, lime 125, green 145, teal 190, cyan 215, blue 255, indigo 275, violet 295, magenta 330, pink 350.
4. Optionally change the typefaces (`--typeface-sans`, `--typeface-heading`, `--typeface-mono`). A new web font needs two things: `npm i @fontsource-variable/<font>` and an `@import "@fontsource-variable/<font>";` line at the top of the theme file. The family name is `'<Font> Variable'`.
5. Optionally change the shape scale (`--shape-xs` ... `--shape-xl`; keep `--shape-full: 9999px`) and the motion values.
6. **Leave everything else alone**, in particular the `--md-*` formulas, the elevation and layout variables, and the shadcn mapping at the bottom.
7. Run `npm run check:theme -- src/themes/<name>.css` and fix anything it reports.
8. Preview it: open `/gallery`. Every file in `src/themes` appears in the "Preview" section automatically.
9. To use it for real, copy it over `src/theme.css`.

### Matching an exact brand color

Hues give a palette in the right family, not an exact hex. To pin a role, overwrite it in **both** places, the light `:root` and the dark block, with `oklch(...)`, `#hex` or `rgb(...)` (other formats work but skip the contrast check). Then re-run `npm run check:theme`: a brand color that fails contrast must be adjusted, and the on-color (`--md-on-primary` etc.) usually needs to change with it.

### Prompt you can paste

```text
Create a new m3 theme called "<name>".
Read docs/theming.md first and follow "Create a theme".
Brand: <describe, or give hex colors>. Mood: <e.g. calm, playful, corporate>.
Typeface: <font or "keep Geist">. Corners: <sharp | default | very round>.
Write src/themes/<name>.css by copying src/themes/violet.css and changing only what the recipe allows.
Then run `npm run check:theme -- src/themes/<name>.css` and fix every error until it prints a check mark.
```

## Validation

`npm run check:theme` checks `src/theme.css` and every file in `src/themes`. `npm run check:theme -- path/to/file.css` checks one file, and `--verbose` also prints every contrast ratio. It exits with an error if:

- a required variable is missing from the light `:root` (hues, typefaces, shapes, motion, elevation, layout, color roles, shadcn mapping) or a color role is missing from the dark block, or the dark block does not exist
- a hue is not a number from 0 to 360, a duration is not like `150ms`, or a shape is not a length
- a shadcn variable points at a variable that does not exist
- a foreground/background pair is below its WCAG minimum, in light **and** dark: all `on-*` roles on their container (4.5:1), `on-surface` and `on-surface-variant` on the surfaces (4.5:1), `primary` and `error` text on `surface` (4.5:1), and `outline` on `surface` (3:1)

Colors in `oklch()`, `#hex` and `rgb()` are checked. Other formats (for example `hsl()`) produce a warning and are skipped.

## Variable reference

| Group | Variables | Notes |
| --- | --- | --- |
| Seed hues | `--hue-primary`, `--hue-secondary`, `--hue-tertiary`, `--hue-error`, `--hue-neutral` | oklch hue angle, 0 to 360. `--hue-neutral` tints the surfaces and outlines. |
| Typography | `--typeface-sans`, `--typeface-heading`, `--typeface-mono` | Font stacks. `--typeface-heading` may reference `var(--typeface-sans)`. |
| Shape | `--shape-xs`, `--shape-sm`, `--shape-md`, `--shape-lg`, `--shape-xl`, `--shape-full` | Border radii. `--shape-full` makes pills. |
| Motion | `--motion-easing-standard`, `--motion-easing-emphasized`, `--motion-easing-accelerate`, `--motion-duration-short`, `--motion-duration-medium`, `--motion-duration-long` | Used by every transition. |
| Elevation | `--elevation-0` ... `--elevation-3` | Box shadows built from `--md-shadow`. |
| Layout | `--layout-appbar-height`, `--layout-sidebar-width`, `--layout-sidebar-width-collapsed` | App shell sizes. |
| Color roles | `--md-*` (table below) | The full M3 role set. Defined for light in `:root` and for dark in the media block. |
| shadcn mapping | `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--ring`, `--chart-1` ... `--sidebar-*` | Derived from the `--md-*` roles. Do not edit these to recolor. |

## Color role recipe

Light and dark values used by the shipped themes: `L` is oklch lightness (0 to 1), `C` is chroma, and the hue comes from the seed named in the last column. Reuse these numbers when you add a role; change them only if `npm run check:theme` says to.

| Role | Light | Dark | Hue seed |
| --- | --- | --- | --- |
| `--md-primary` | L 0.45, C 0.15 | L 0.8, C 0.12 | primary |
| `--md-on-primary` | L 0.99, C 0.005 | L 0.3, C 0.1 | primary |
| `--md-primary-container` | L 0.91, C 0.06 | L 0.38, C 0.12 | primary |
| `--md-on-primary-container` | L 0.25, C 0.1 | L 0.92, C 0.05 | primary |
| `--md-secondary` | L 0.47, C 0.06 | L 0.8, C 0.06 | secondary |
| `--md-on-secondary` | L 0.99, C 0.005 | L 0.3, C 0.05 | secondary |
| `--md-secondary-container` | L 0.91, C 0.04 | L 0.38, C 0.06 | secondary |
| `--md-on-secondary-container` | L 0.26, C 0.05 | L 0.92, C 0.03 | secondary |
| `--md-tertiary` | L 0.47, C 0.1 | L 0.8, C 0.09 | tertiary |
| `--md-on-tertiary` | L 0.99, C 0.005 | L 0.3, C 0.08 | tertiary |
| `--md-tertiary-container` | L 0.92, C 0.05 | L 0.38, C 0.09 | tertiary |
| `--md-on-tertiary-container` | L 0.27, C 0.08 | L 0.92, C 0.04 | tertiary |
| `--md-error` | L 0.5, C 0.19 | L 0.8, C 0.12 | error |
| `--md-on-error` | L 0.99, C 0.005 | L 0.3, C 0.12 | error |
| `--md-error-container` | L 0.92, C 0.05 | L 0.38, C 0.13 | error |
| `--md-on-error-container` | L 0.28, C 0.13 | L 0.92, C 0.05 | error |
| `--md-surface` | L 0.985, C 0.006 | L 0.17, C 0.012 | neutral |
| `--md-surface-dim` | L 0.88, C 0.012 | L 0.15, C 0.01 | neutral |
| `--md-surface-bright` | L 0.985, C 0.006 | L 0.28, C 0.012 | neutral |
| `--md-surface-container-lowest` | L 1, C 0 | L 0.13, C 0.01 | neutral |
| `--md-surface-container-low` | L 0.97, C 0.008 | L 0.19, C 0.012 | neutral |
| `--md-surface-container` | L 0.955, C 0.01 | L 0.21, C 0.013 | neutral |
| `--md-surface-container-high` | L 0.94, C 0.012 | L 0.25, C 0.014 | neutral |
| `--md-surface-container-highest` | L 0.92, C 0.014 | L 0.28, C 0.015 | neutral |
| `--md-on-surface` | L 0.2, C 0.012 | L 0.92, C 0.01 | neutral |
| `--md-on-surface-variant` | L 0.45, C 0.02 | L 0.8, C 0.02 | neutral |
| `--md-outline` | L 0.58, C 0.02 | L 0.62, C 0.02 | neutral |
| `--md-outline-variant` | L 0.82, C 0.02 | L 0.38, C 0.02 | neutral |
| `--md-scrim` | `oklch(0 0 0 / 32%)` | `oklch(0 0 0 / 32%)` | - |
| `--md-shadow` | `oklch(0 0 0 / 18%)` | `oklch(0 0 0 / 50%)` | - |

## Gotchas

- To recolor, change the seed hues or the `--md-*` roles. Never edit `--primary`, `--background` and the other shadcn variables: they are derived and would drift from the M3 roles.
- Both modes need to be readable. The validator checks both; a theme that only looks right in light mode is still broken.
- Do not add a `.dark` class or a theme toggle. Dark mode is the system preference by design.
- Do not hard-code colors, radii or durations in components. Add or change a variable in the theme instead.
