# AGENTS.md

Instructions for AI coding assistants (Claude Code, Cursor, Copilot, Codex, ...) working in this repo. People: see [README.md](README.md).

## What this is

m3 is Material Design 3 components for React: the shadcn/ui components (Radix) restyled with M3 tokens, 11 hand-built extras, and an application boilerplate. React 19, TypeScript 7, Vite 8, Tailwind CSS v4. All colors, radii, fonts and motion come from **one file**, `src/theme.css`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server. Look at `/gallery` (components) and `/boilerplate` (boilerplate). |
| `npm run lint` / `npm run lint:fix` | oxlint (correctness) + ESLint (ordering rules). `lint:fix` fixes import order. |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.app.json` |
| `npm run build` | Typecheck + production build |
| `npm run check:gallery` | Every component and boilerplate util must have a gallery section |
| `npm run check:theme` | Validates `src/theme.css` and `src/themes/*.css` (variables, light + dark, contrast) |

**Done means** lint, typecheck, build, `check:gallery` and `check:theme` all pass. There is no test runner; verify UI changes in the browser at `/gallery` and `/boilerplate`.

## Where things live

```
src/theme.css                 the active theme (the only place visual values are defined)
src/themes/*.css              alternative themes, same structure; inactive until copied over theme.css
src/index.css                 maps theme variables to Tailwind utilities (bg-md-*, shadow-elevation-*, ease-*)
src/components/ui/            all components (shadcn-generated + 11 hand-built)
src/gallery/                  /gallery: one <Section name="<file name>"> per ui component, plus ThemeSection
src/boilerplate/common|layouts|pages/   boilerplate components
src/boilerplate/utils/        logger, analytics, errorCodes, http, apiUrls, cache, constants
src/boilerplate/gallery/      /boilerplate: tabbed gallery; EmbedRoutes.tsx serves the iframe demos
scripts/                      check-gallery.mjs, check-theme.mjs
docs/theming.md               theme spec and recipe
```

## Rules

**Styling**
- Never hard-code colors, radii, font names, easing or durations in components. Use the tokens: `bg-md-primary-container`, `text-md-on-surface`, `rounded-xl`, `shadow-elevation-2`, `ease-emphasized`, `duration-(--motion-duration-medium)`.
- To change how things look, change `src/theme.css`. Never edit the shadcn variables (`--primary`, `--background`, ...); they are derived from the `--md-*` roles. Read `docs/theming.md` before touching a theme.
- Dark mode is the system preference (`prefers-color-scheme`). There is no `.dark` class and no toggle.

**Components**
- shadcn-generated files are overwritten by the CLI. Do not hand-edit them. To restyle, use the theme. They are listed in the `cliGenerated` array in `eslint.config.js`.
- Add a shadcn component with `npx shadcn@latest add <name>`, then add its file name to `cliGenerated`.
- The 11 hand-built components (Rating, Transfer List, FAB, List, Typography, Backdrop, App Bar, Paper, Bottom Navigation, Speed Dial, Stepper) follow the shadcn conventions: `cva` variants, `data-slot` attributes, Radix primitives where they exist, tokens only. Copy an existing one when adding another.
- Every file in `src/components/ui` needs a `<Section name="<file name>">` in `src/gallery` showing all variants and states. `npm run check:gallery` enforces it.

**Boilerplate** (`src/boilerplate`)
- Every component or util there needs a `<Section name="<FileName>">` in `src/boilerplate/gallery/{ComponentSections,PageSections,UtilSections}.tsx`, with a playground and a `<Snippet code={...} />`. Export it from `src/boilerplate/index.ts`.
- All logging goes through `Logger` (`utils/logger.ts`). That file is the only place allowed to call `console` (`no-console` is a lint error elsewhere).
- Throw `ApiError` for HTTP failures; add error codes to `ErrorCodes` in `utils/errorCodes.ts`.
- react-router v7 forbids nested routers. A demo that needs its own router goes in `EmbedRoutes.tsx` and is shown in an `<iframe>`.
- No MUI, Emotion or Auth0. `PrivateRoute` is auth-agnostic on purpose.

**Code conventions (ESLint-enforced on hand-written files)**
- Type and prop members: required first, then optional, each group alphabetical (case-insensitive).
- Imports: libraries, then `@/` imports, then parent (`../`), then sibling (`./`); alphabetical within each group; no blank lines between imports. `npm run lint:fix` sorts them.
- `erasableSyntaxOnly` is on: no `enum`, no constructor parameter properties. Use `as const` objects.

**Tooling gotchas**
- `typescript` in `package.json` is an alias for the TS 6 API (typescript-eslint needs it); `@typescript/native` provides the TS 7 `tsc`. Do not "fix" this.
- ESLint is pinned to v9 because `eslint-plugin-react` does not support v10.

## Common tasks

- **New theme:** follow `docs/theming.md` ("Create a theme"), then `npm run check:theme -- src/themes/<name>.css`. It appears in the gallery's Theme preview automatically.
- **New component or util:** see the rules above, then run all five "done" commands.
