/** m3 version from package.json, injected by vite.config.ts at build time. */
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  /** Backend origin, e.g. https://api.example.com — defaults to same-origin. */
  readonly VITE_API_HOST?: string
}
