# m3

### [https://m3.khojlabs.com](https://m3.khojlabs.com)
Material Design 3 components for React

<img width="250" height="150" alt="" src="https://github.com/user-attachments/assets/93bc64d6-3211-4a81-a95b-2c89c6c6e870" />

# What
1. m3 takes the 30 shadcn/ui components that map to Material UI's core set
2. adds the 11 that shadcn doesn't ship (Rating, Transfer List, FAB, List, Typography, Backdrop, App Bar, Paper, Bottom Navigation, Speed Dial, Stepper)
3. restyles all of them with M3 design tokens: tonal surface colors, pill and large radii, and a shared motion curve. Dark mode follows the system preference.
4. Adds every color, radius, font and easing value in **one file**, `src/theme.css`; you can change the look of the whole library by replacing that file.
5. Adds application boilerplate (`src/boilerplate`) from react-gold-tsx - page header, list page, empty and 404 pages, app shell with collapsible side nav, route guard, alerts, error boundary, and utilities: logger, analytics facade, HTTP client, localStorage cache and keys, API error codes

# Getting Started

```sh
npm install
npm run dev
```

Then open `/gallery`: every component in all variants and states, plus tabs for the boilerplate's page components and utilities.

# Overriding the theme

## Make your own theme

Nobody has to hand-write one. A theme is five seed hues plus fonts, shapes and motion, and `npm run check:theme` validates the result (every variable present, light and dark both defined, WCAG contrast). So hand the job to an AI assistant; it reads [`AGENTS.md`](AGENTS.md) and [`docs/theming.md`](docs/theming.md) on its own. Fill in the angle brackets:

```text
Create a new m3 theme called "<name>".
Read docs/theming.md first and follow "Create a theme".
Brand: <describe your brand, or give hex colors>. Mood: <calm, playful, corporate, ...>. Typeface: <a font, or "keep Geist">. Corners: <sharp | default | very round>.
Write src/themes/<name>.css, then run `npm run check:theme -- src/themes/<name>.css` and fix every error until it passes.
```

For example: name `forest`, brand "deep green with warm amber accents", mood "calm", typeface "keep Geist", corners "very round".

Every file in `src/themes` shows up in the gallery's "Preview" section automatically, so you can try it across all components before applying it. To apply it, ask the assistant to copy it over `src/theme.css`, which is the only place visual values are defined. The full spec is in [`docs/theming.md`](docs/theming.md).

## Overriding the boilerplate

| To change | Use |
| --- | --- |
| API base URL | `VITE_API_HOST` (see `.env.example`) and `configureHttp({ baseUrl, getToken, timeoutMs })` |
| Analytics provider | `configureAnalytics({ adapters: [yourAdapter] })`; an adapter is five methods (`init`, `identify`, `pageView`, `reset`, `track`) |
| Error handling | `<ErrorBoundary fallback onError homeHref supportEmail>`; add your own groups to `ErrorCodes`; `http` throws `ApiError` (use `errorCodeFromStatus` to map a status to a code) |
| Logging | `Logger.error(code, details)` (also `info`, `warn`); `setLogUserId(id)` attributes later logs to a user; `onLog(listener)` forwards every entry to your own sink (Sentry, Datadog, ...) |
| Storage | Keys live in `CacheKeys`; read and write through `save`, `retrieve`, `saveJson`, `retrieveJson` and `remove` |
| Navigation | Pass `NavItem[]` to `<AppShell nav userMenu />` |
| Auth | `<PrivateRoute isAuthenticated isLoading redirectTo />` is auth-agnostic; bring your own provider |

## Development

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build |
| `npm run typecheck` | Typecheck the app (`tsc --noEmit -p tsconfig.app.json`) |
| `npm run lint` | oxlint (correctness) plus ESLint (ordering rules) |
| `npm run lint:fix` | Same, applying auto-fixes (import order) |
| `npm run check:gallery` | Fails if a component in `src/components/ui` or a component/util in `src/boilerplate` has no gallery section |
| `npm run check:theme` | Validates `src/theme.css` and every file in `src/themes`: required variables, light and dark, contrast (`--verbose` prints every ratio) |

Code conventions enforced by ESLint on hand-written code (shadcn-generated files are excluded):

- Props and type members: required first, then optional, each alphabetical
- Imports: libraries, then `@/` common, then parent, then sibling; alphabetical within each group
- No `console` outside `src/boilerplate/utils/logger.ts`; use `Logger`

TypeScript 7 runs `tsc`. typescript-eslint doesn't support TS 7 yet, so the `typescript` package name is aliased to the TS 6 API for ESLint only (see `package.json`). Remove the alias once typescript-eslint supports it.

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Credits

m3 stands on the work of others. Thank you to all of the following.

**Design and source projects**

| Project | How it's used |
| --- | --- |
| [Material Design 3](https://m3.material.io) by Google | The design language and token system m3 implements. m3 is an independent project, not affiliated with or endorsed by Google. |
| [shadcn/ui](https://github.com/shadcn-ui/ui) by shadcn (MIT) | The component model, CLI and the 30 base components |
| [react-gold-tsx](https://github.com/Midnight-Coder/react-gold-tsx) by Midnight-Coder | Source of the boilerplate components, logger, analytics, error and HTTP utilities, rebuilt here on shadcn |

**Libraries**

| Library | License | Used for |
| --- | --- | --- |
| [Radix UI](https://github.com/radix-ui/primitives) (`radix-ui`) | MIT | Accessible primitives behind most components |
| [Base UI](https://github.com/mui/base-ui) (`@base-ui/react`) | MIT | Combobox primitive |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | MIT | Styling |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | MIT | Enter/exit animation utilities |
| [class-variance-authority](https://github.com/joe-bell/cva) | Apache-2.0 | Component variants |
| [cn](https://github.com/shadcn-ui/cn) | MIT | Class name merging |
| [Lucide](https://github.com/lucide-icons/lucide) (`lucide-react`) | ISC | Icons |
| [Sonner](https://github.com/emilkowalski/sonner) by Emil Kowalski | MIT | Toasts |
| [next-themes](https://github.com/pacocoursey/next-themes) | MIT | Theme integration for Sonner |
| [React](https://github.com/react/react) and [React Router](https://github.com/remix-run/react-router) | MIT | UI and routing |
| [Vite](https://github.com/vitejs/vite) | MIT | Dev server and build |
| [TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 | Types |
| [ESLint](https://github.com/eslint/eslint), [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint), [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x), [oxlint](https://github.com/oxc-project/oxc) | MIT | Linting |

**Fonts** (via [Fontsource](https://github.com/fontsource/font-files), SIL Open Font License 1.1)

- [Geist](https://github.com/vercel/geist-font) by Vercel
- [Fraunces](https://github.com/undercasetype/Fraunces) by Undercase Type
