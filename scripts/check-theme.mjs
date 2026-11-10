// Validates theme files: required variables, light + dark definitions, and WCAG contrast.
//
//   npm run check:theme                      # src/theme.css and every file in src/themes
//   npm run check:theme -- path/to/theme.css # just that file
//   npm run check:theme -- --verbose         # also print every contrast ratio
//
// Exits 1 on any error. Spec: docs/theming.md
import { readdirSync, readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const paths = args.filter((a) => !a.startsWith('--'))
const files = paths.length
  ? paths
  : ['src/theme.css', ...readdirSync('src/themes').filter((f) => f.endsWith('.css')).map((f) => `src/themes/${f}`)]

// ── Required variables ──────────────────────────────────────────────────────
const roles = [
  'primary', 'on-primary', 'primary-container', 'on-primary-container',
  'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
  'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
  'error', 'on-error', 'error-container', 'on-error-container',
  'surface', 'surface-dim', 'surface-bright',
  'surface-container-lowest', 'surface-container-low', 'surface-container',
  'surface-container-high', 'surface-container-highest',
  'on-surface', 'on-surface-variant', 'outline', 'outline-variant', 'scrim', 'shadow',
].map((r) => `--md-${r}`)

const shadcn = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
].map((r) => `--${r}`)

const seeds = ['primary', 'secondary', 'tertiary', 'error', 'neutral'].map((r) => `--hue-${r}`)
const typefaces = ['sans', 'heading', 'mono'].map((r) => `--typeface-${r}`)
const shapes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'].map((r) => `--shape-${r}`)
const easings = ['standard', 'emphasized', 'accelerate'].map((r) => `--motion-easing-${r}`)
const durations = ['short', 'medium', 'long'].map((r) => `--motion-duration-${r}`)
const elevations = [0, 1, 2, 3].map((r) => `--elevation-${r}`)
const layout = ['appbar-height', 'sidebar-width', 'sidebar-width-collapsed'].map((r) => `--layout-${r}`)

// [foreground, background, minimum ratio, why]
const contrastPairs = [
  ['on-primary', 'primary', 4.5], ['on-primary-container', 'primary-container', 4.5],
  ['on-secondary', 'secondary', 4.5], ['on-secondary-container', 'secondary-container', 4.5],
  ['on-tertiary', 'tertiary', 4.5], ['on-tertiary-container', 'tertiary-container', 4.5],
  ['on-error', 'error', 4.5], ['on-error-container', 'error-container', 4.5],
  ['on-surface', 'surface', 4.5], ['on-surface', 'surface-container-lowest', 4.5],
  ['on-surface', 'surface-container-low', 4.5], ['on-surface', 'surface-container', 4.5],
  ['on-surface', 'surface-container-high', 4.5], ['on-surface', 'surface-container-highest', 4.5],
  ['on-surface-variant', 'surface', 4.5], ['on-surface-variant', 'surface-container', 4.5],
  ['primary', 'surface', 4.5], // text-primary on the page background
  ['error', 'surface', 4.5], // text-destructive on the page background
  ['outline', 'surface', 3], // input borders (WCAG 1.4.11 non-text contrast)
].map(([fg, bg, min]) => ({ bg: `--md-${bg}`, fg: `--md-${fg}`, min }))

// ── CSS parsing (just enough for theme files) ───────────────────────────────
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** Top-level `selector { body }` blocks. */
function blocks(css) {
  const out = []
  let i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open < 0) break
    let depth = 1
    let j = open + 1
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth += 1
      else if (css[j] === '}') depth -= 1
      j += 1
    }
    out.push({ body: css.slice(open + 1, j - 1), selector: css.slice(i, open).split(';').pop().trim() })
    i = j
  }
  return out
}

const declarations = (body) => {
  const vars = {}
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim()
  return vars
}

function parseTheme(raw) {
  const css = stripComments(raw)
  const light = {}
  const dark = {}
  let hasDarkBlock = false
  for (const { body, selector } of blocks(css)) {
    if (selector === ':root') Object.assign(light, declarations(body))
    else if (/^@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)$/.test(selector)) {
      hasDarkBlock = true
      for (const inner of blocks(body)) if (inner.selector === ':root') Object.assign(dark, declarations(inner.body))
    }
  }
  return { dark, hasDarkBlock, light }
}

/** Replace var(--x) references using `scope` (dark mode = light with dark overrides). */
function resolve(value, scope, depth = 0) {
  if (depth > 12) return value
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g, (_, name) => (scope[name] === undefined ? `var(${name})` : resolve(scope[name], scope, depth + 1)))
}

// ── Colour maths ────────────────────────────────────────────────────────────
const clamp = (x) => Math.min(1, Math.max(0, x))
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** → linear sRGB [r, g, b] in 0..1, or null if the colour format isn't understood. */
function toLinearRgb(input) {
  const s = input.trim()
  let m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/i)
  if (m) {
    const L = parseFloat(m[1]) / (m[2] ? 100 : 1)
    const C = parseFloat(m[3])
    const h = (parseFloat(m[4]) * Math.PI) / 180
    const a = C * Math.cos(h)
    const b = C * Math.sin(h)
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const ss = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
    return [
      clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss),
      clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss),
      clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * ss),
    ]
  }
  m = s.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (m) {
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
    return [0, 2, 4].map((i) => srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255))
  }
  m = s.match(/^rgb\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*\)$/i)
  if (m) return [1, 2, 3].map((i) => srgbToLinear(parseInt(m[i], 10) / 255))
  return null
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// ── Checks ──────────────────────────────────────────────────────────────────
function check(file) {
  const errors = []
  const warnings = new Set()
  const details = []
  const { dark, hasDarkBlock, light } = parseTheme(readFileSync(file, 'utf8'))

  const need = (names, scope, label) => {
    const missing = names.filter((n) => scope[n] === undefined)
    if (missing.length) errors.push(`${label} missing: ${missing.join(', ')}`)
  }

  need([...seeds, ...typefaces, ...shapes, ...easings, ...durations, ...elevations, ...layout], light, 'light (:root)')
  need(roles, light, 'light (:root) color roles')
  need(shadcn, light, 'shadcn mapping in :root')
  if (!hasDarkBlock) errors.push('no @media (prefers-color-scheme: dark) { :root { … } } block')
  else need(roles, dark, 'dark block color roles')

  for (const seed of seeds) {
    const v = Number(light[seed])
    if (light[seed] !== undefined && !(Number.isFinite(v) && v >= 0 && v <= 360)) errors.push(`${seed} must be a number from 0 to 360 (got "${light[seed]}")`)
  }
  for (const d of durations) {
    if (light[d] !== undefined && !/^[\d.]+m?s$/.test(light[d])) errors.push(`${d} must look like 150ms or 0.3s (got "${light[d]}")`)
  }
  for (const s of shapes) {
    if (light[s] !== undefined && !/^[\d.]+(px|rem|em)$/.test(light[s]) && s !== '--shape-full') errors.push(`${s} must be a length like 8px (got "${light[s]}")`)
  }

  const modes = [['light', light], ['dark', { ...light, ...dark }]]
  for (const [mode, scope] of modes) {
    for (const name of shadcn) {
      if (scope[name] === undefined) continue
      if (/var\(/.test(resolve(scope[name], scope))) errors.push(`${mode}: ${name} points at an undefined variable (${scope[name]})`)
    }
    for (const { bg, fg, min } of contrastPairs) {
      if (scope[fg] === undefined || scope[bg] === undefined) continue
      const a = toLinearRgb(resolve(scope[fg], scope))
      const b = toLinearRgb(resolve(scope[bg], scope))
      if (!a || !b) {
        warnings.add(`${mode}: could not read ${!a ? fg : bg} (${resolve(scope[!a ? fg : bg], scope)}); use oklch(), #hex or rgb() to enable the contrast check`)
        continue
      }
      const r = ratio(a, b)
      details.push(`${mode}: ${fg.replace('--md-', '')} on ${bg.replace('--md-', '')} = ${r.toFixed(2)}:1 (needs ${min})`)
      if (r < min) errors.push(`${mode}: ${fg.replace('--md-', '')} on ${bg.replace('--md-', '')} has contrast ${r.toFixed(2)}:1, needs ${min}:1`)
    }
  }
  return { details, errors, warnings: [...warnings] }
}

let failed = false
for (const file of files) {
  let result
  try { result = check(file) }
  catch (error) {
    console.error(`✗ ${file}\n    cannot read: ${error.message}`)
    failed = true
    continue
  }
  const { details, errors, warnings } = result
  console.log(`${errors.length ? '✗' : '✓'} ${file}${errors.length ? '' : '  (all variables defined, contrast OK in light and dark)'}`)
  if (verbose) details.forEach((d) => console.log(`    ${d}`))
  warnings.forEach((w) => console.log(`    warning: ${w}`))
  errors.forEach((e) => console.log(`    ${e}`))
  if (errors.length) failed = true
}
process.exit(failed ? 1 : 0)
