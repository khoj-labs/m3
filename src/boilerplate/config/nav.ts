import type { LucideIcon } from "lucide-react"

export type NavItem = {
  Icon: LucideIcon
  name: string
  /** Router path. */
  to: string
  /** Shows a "Create New" button in PageHeader when set. */
  createLink?: string
}
