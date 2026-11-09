// Usage: npm run theme -- <name>   (copies src/themes/<name>.css over src/theme.css)
import { copyFileSync, existsSync, readdirSync } from 'node:fs'

const name = process.argv[2]
const dir = new URL('../src/themes/', import.meta.url)
const available = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => f.slice(0, -4))
if (!name || !existsSync(new URL(`${name}.css`, dir))) {
  console.error(`Usage: npm run theme -- <${available.join('|')}>`)
  process.exit(1)
}
copyFileSync(new URL(`${name}.css`, dir), new URL('../src/theme.css', import.meta.url))
console.log(`src/theme.css ← themes/${name}.css`)
