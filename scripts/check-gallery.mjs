// Fails if any component in src/components/ui has no <Section name="…"> in the gallery.
import { readdirSync, readFileSync } from 'node:fs'

const ui = readdirSync(new URL('../src/components/ui/', import.meta.url)).filter((f) => f.endsWith('.tsx')).map((f) => f.slice(0, -4))
const src = readdirSync(new URL('../src/gallery/', import.meta.url)).map((f) => readFileSync(new URL(`../src/gallery/${f}`, import.meta.url), 'utf8')).join('\n')
const missing = ui.filter((n) => !src.includes(`name="${n}"`))
if (missing.length) {
  console.error('Missing from gallery:', missing.join(', '))
  process.exit(1)
}
console.log(`gallery covers all ${ui.length} components`)
