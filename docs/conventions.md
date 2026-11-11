# Conventions and tasks

Rules for working in the m3 codebase, for people and assistants. The short, always-on version is in [AGENTS.md](../AGENTS.md); theming is in [theming.md](theming.md).

**Done means** lint, typecheck, build, `check:gallery` and `check:theme` all pass. There is no test runner; verify UI changes in the browser at `/gallery`.

## Components

- shadcn-generated files are overwritten by the CLI. Do not hand-edit them. To restyle, use the theme. They are listed in the `cliGenerated` array in `eslint.config.js`.
- Add a shadcn component with `npx shadcn@latest add <name>`, then add its file name to `cliGenerated`.
- The 11 hand-built components (Rating, Transfer List, FAB, List, Typography, Backdrop, App Bar, Paper, Bottom Navigation, Speed Dial, Stepper) follow the shadcn conventions: `cva` variants, `data-slot` attributes, Radix primitives where they exist, tokens only. Copy an existing one when adding another.
- Every file in `src/components/ui` needs a `<Section name="<file name>">` in `src/gallery` showing all variants and states. `npm run check:gallery` enforces it.

## Boilerplate (`src/boilerplate`)

- Every component or util there needs a `<Section name="<FileName>">` in `src/boilerplate/gallery/{ComponentSections,PageSections,UtilSections}.tsx`, with a playground and a `<Snippet code={...} />`. Export it from `src/boilerplate/index.ts`.
- All logging goes through `Logger` (`utils/logger.ts`). That file is the only place allowed to call `console` (`no-console` is a lint error elsewhere).
- Throw `ApiError` for HTTP failures; add error codes to `ErrorCodes` in `utils/errorCodes.ts`.
- react-router v7 forbids nested routers. A demo that needs its own router goes in `EmbedRoutes.tsx` and is shown in an `<iframe>`.
- No MUI, Emotion or Auth0. `PrivateRoute` is auth-agnostic on purpose.

## Code style (ESLint-enforced on hand-written files)

- Type and prop members: required first, then optional, each group alphabetical (case-insensitive).
- Imports: libraries, then `@/` imports, then parent (`../`), then sibling (`./`); alphabetical within each group; no blank lines between imports. `npm run lint:fix` sorts them.
- `erasableSyntaxOnly` is on: no `enum`, no constructor parameter properties. Use `as const` objects.

## Tooling gotchas

- `typescript` in `package.json` is an alias for the TS 6 API (typescript-eslint needs it); `@typescript/native` provides the TS 7 `tsc`. Do not "fix" this.
- ESLint is pinned to v9 because `eslint-plugin-react` does not support v10.

## Common tasks

- **New theme:** follow [theming.md](theming.md) ("Create a theme"), then `npm run check:theme -- src/themes/<name>.css`. It appears in the gallery's "Preview" section automatically.
- **Apply a theme:** copy `src/themes/<name>.css` over `src/theme.css` (the bundled themes are `violet.css`, the default, and `ocean.css`), then run `npm run check:theme` and `npm run build`.
- **New component or util:** follow the rules above, then run all five "done" commands.
