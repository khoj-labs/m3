// Fails if a component has no <Section name="…"> in its gallery:
//   src/components/ui      → src/gallery
//   src/boilerplate/{common,layouts,pages,utils} → src/boilerplate/gallery
import { readdirSync, readFileSync } from 'node:fs'

const dir = (path) => new URL(`../${path}/`, import.meta.url)
const names = (path, filter) => readdirSync(dir(path)).filter(filter).map((f) => f.replace(/\.tsx?$/, ''))
const read = (path) => readdirSync(dir(path)).map((f) => readFileSync(new URL(f, dir(path)), 'utf8')).join('\n')

const targets = [
  { gallery: 'src/gallery', label: 'components/ui', names: names('src/components/ui', (f) => f.endsWith('.tsx')) },
  {
    gallery: 'src/boilerplate/gallery',
    label: 'boilerplate',
    names: ['common', 'layouts', 'pages'].flatMap((d) => names(`src/boilerplate/${d}`, (f) => f.endsWith('.tsx')))
      .concat(names('src/boilerplate/utils', (f) => f.endsWith('.ts') && !f.endsWith('.types.ts'))),
  },
]

let failed = false
for (const { gallery, label, names: expected } of targets) {
  const src = read(gallery)
  const missing = expected.filter((n) => !src.includes(`name="${n}"`))
  if (missing.length) {
    console.error(`Missing from ${gallery}:`, missing.join(', '))
    failed = true
  }
  else console.log(`${label}: gallery covers all ${expected.length}`)
}
process.exit(failed ? 1 : 0)
