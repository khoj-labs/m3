# m3
Material Design 3 components for React

<img width="250" height="150" alt="" src="https://github.com/user-attachments/assets/93bc64d6-3211-4a81-a95b-2c89c6c6e870" /> 

# What
1. m3 takes the 30 shadcn/ui components that map to Material UI's core set
2. adds the 11 that shadcn doesn't ship (Rating, Transfer List, FAB, List, Typography, Backdrop, App Bar, Paper, Bottom Navigation, Speed Dial, Stepper)
3. restyles all of them with M3 design tokens: tonal surface colors, pill and large radii, and a shared motion curve.
4. Adds every color, radius, font and easing value in **one file**, `src/theme.css`; you can change the look of the whole library by replacing that file.
5. Adds application boilerplate (`src/boilerplate`) from react-gold-tsx - page header, app shell with collapsible side nav, error boundary, logger, analytics facade, HTTP client, dark mode support

# Demo


## Component Library
https://github.com/user-attachments/assets/c3e20539-caab-4683-a1f0-0e45645a58f8



## App Boilerplate
https://github.com/user-attachments/assets/9d23c14e-d071-4e78-9a60-893d93c448cf


```sh
npm install
npm run dev
```

# Overriding the theme

## Replace the theme file

`src/theme.css` is the only place visual values are defined. Components never hard-code colors, radii, fonts or easing. Swap the whole look by replacing that file with another that defines the same variables:


To make your own, copy `src/themes/violet.css` to `src/themes/<name>.css`, edit it, and run `npm run theme -- <name>`. The gallery's theme switcher previews the two bundled example themes without touching `theme.css`.

## What you can change

| Group | Variables | Notes |
| --- | --- | --- |
| Seed hues | `--hue-primary`, `--hue-secondary`, `--hue-tertiary`, `--hue-error`, `--hue-neutral` | oklch hue angles; the tonal colors below are derived from them |
| Color roles | `--md-primary`, `--md-on-primary`, `--md-primary-container`, `--md-surface`, `--md-surface-container-*`, `--md-on-surface`, `--md-outline`, ... | The full M3 role set. Overwrite any of them directly for exact colors. |
| Typography | `--typeface-sans`, `--typeface-heading`, `--typeface-mono` | Load fonts with an `@import` at the top of the theme file (the themes use Fontsource) |
| Shape | `--shape-xs` to `--shape-xl`, `--shape-full` | `--shape-full` makes pills |
| Motion | `--motion-easing-standard`, `--motion-easing-emphasized`, `--motion-easing-accelerate`, `--motion-duration-short`, `--motion-duration-medium`, `--motion-duration-long` | Used for every transition |
| Elevation | `--elevation-0` to `--elevation-3`, `--md-shadow` | |
| Layout | `--layout-appbar-height`, `--layout-sidebar-width`, `--layout-sidebar-width-collapsed` | App shell dimensions |

The color roles are defined for light mode in `:root` and redefined inside `@media (prefers-color-scheme: dark)`. The shadcn variables (`--background`, `--primary`, `--border`, ...) are mapped onto the M3 roles at the bottom of the file, so shadcn components pick up your theme automatically.

## Using the tokens in your own code

`src/index.css` exposes the tokens as Tailwind utilities:

```tsx
<div className="bg-md-primary-container text-md-on-primary-container rounded-xl shadow-elevation-2 ease-emphasized" />
```

## Overriding a single component

Components live in `src/components/ui` and are yours to edit. For a one-off, pass `className`. Note that re-running `npx shadcn add <name> --overwrite` replaces the shadcn-generated files, so keep deep edits to the hand-built components (Rating, Transfer List, FAB, List, Typography, Backdrop, App Bar, Paper, Bottom Navigation, Speed Dial, Stepper), or restyle through the theme instead.

## Overriding the boilerplate

| To change | Use |
| --- | --- |
| API base URL | `VITE_API_HOST` (see `.env.example`) and `configureHttp({ baseUrl, getToken, timeoutMs })` |
| Analytics provider | `configureAnalytics({ adapters: [yourAdapter] })`; an adapter is five methods (`init`, `identify`, `pageView`, `reset`, `track`) |
| Error handling | `<ErrorBoundary fallback onError homeHref supportEmail>`; add your own groups to `ErrorCodes` |
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
| `npm run check:gallery` | Fails if a component in `src/components/ui` has no gallery section |
| `npm run theme -- <name>` | Swap `src/theme.css` for `src/themes/<name>.css` |

Code conventions enforced by ESLint on hand-written code (shadcn-generated files are excluded):

- Props and type members: required first, then optional, each alphabetical
- Imports: libraries, then `@/` common, then parent, then sibling; alphabetical within each group
- No `console` outside `src/boilerplate/utils/logger.ts`; use `Logger`

TypeScript 7 runs `tsc`. typescript-eslint doesn't support TS 7 yet, so the `typescript` package name is aliased to the TS 6 API for ESLint only (see `package.json`). Remove the alias once typescript-eslint supports it.

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
