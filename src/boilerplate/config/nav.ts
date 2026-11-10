import type { LucideIcon } from "lucide-react"

export type NavItem = {
  name: string
  Icon: LucideIcon
  /** Router path. */
  to: string
  /** Shows a "Create New" button in PageHeader when set. */
  createLink?: string
}
