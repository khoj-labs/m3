# AGENTS.md

Instructions for AI coding assistants (Claude Code, Cursor, Copilot, Codex, ...) working in this repo. People: see [README.md](README.md).

m3 is Material Design 3 components for React: the shadcn/ui components (Radix) restyled with M3 tokens, 11 hand-built extras, and an application boilerplate. React 19, TypeScript 7, Vite 8, Tailwind CSS v4. All colors, radii, fonts and motion come from **one file**, `src/theme.css`.

If the user asks about the repo as a whole ("tldr this", "tell me everything", "what is this?") and no file is in focus, follow [docs/tour.md](docs/tour.md).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server. Look at `/gallery`: tabs for Components, Page components and Utils. |
| `npm run lint` / `npm run lint:fix` | oxlint + ESLint (ordering rules); `lint:fix` sorts imports |
| `npm run typecheck` / `npm run build` | `tsc --noEmit` / typecheck + production build |
| `npm run check:gallery` | Every component and boilerplate util must have a gallery section |
| `npm run check:theme` | Validates `src/theme.css` and `src/themes/*.css` |

**Done means** all five of lint, typecheck, build, `check:gallery` and `check:theme` pass. No test runner; verify UI in the browser at `/gallery`.

## Where things live

```
src/theme.css            the active theme (the only place visual values are defined)
src/themes/*.css         alternative themes; inactive until copied over theme.css
src/index.css            maps theme variables to Tailwind utilities (bg-md-*, shadow-elevation-*, ease-*)
src/components/ui/       all components (shadcn-generated + 11 hand-built)
src/boilerplate/         common, layouts, pages, utils (logger, analytics, http, ...), gallery sections
src/gallery/             /gallery page; one <Section name="<file name>"> per component
```

## Rules that matter most

- Never hard-code colors, radii, font names, easing or durations. Use tokens: `bg-md-primary-container`, `text-md-on-surface`, `rounded-xl`, `shadow-elevation-2`, `ease-emphasized`.
- To change the look, change `src/theme.css`; never edit the shadcn variables (`--primary`, `--background`, ...), which derive from `--md-*`. Read [docs/theming.md](docs/theming.md) first.
- Dark mode is the system preference. No `.dark` class, no toggle.
- Do not hand-edit shadcn-generated files (`cliGenerated` in `eslint.config.js`); restyle through the theme.
- Every component or util needs a gallery section (`check:gallery` enforces it). No `console` outside `utils/logger.ts`; use `Logger`.
- Do not "fix" the `typescript` alias to TS 6 or the ESLint v9 pin in `package.json`.

More detail, before you change code: [docs/conventions.md](docs/conventions.md) (component and boilerplate rules, code style, tooling gotchas, common tasks) and [docs/theming.md](docs/theming.md) (theme spec and recipe).
