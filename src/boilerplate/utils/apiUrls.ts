/**
 * Central place for API endpoints. Set VITE_API_HOST (see .env.example) to point at a
 * backend; unset, requests go to the same origin ("/"), which is what a dev proxy wants.
 * (Replaces the original's "__API_HOST__" placeholder that was sed-replaced at deploy.)
 */
const host: string = import.meta.env.VITE_API_HOST ?? '/'
export const baseUrl = host.endsWith('/') ? host : `${host}/`

const apiUrls = {
  status: `${baseUrl}status`,
}

export default apiUrls
