import type { LucideIcon } from "lucide-react"
import { PackageOpenIcon } from "lucide-react"
import { Typography } from "@/components/ui/typography"

type Props = {
  title?: string
  description?: string
  Icon?: LucideIcon
  /** e.g. a call-to-action Button */
  action?: React.ReactNode
}

/** Themed placeholder; replaces the original's two hard-coded-colour SVG illustrations. */
export default function EmptyState({ title = "Nothing to see yet...", description, Icon = PackageOpenIcon, action }: Props) {
  return (
    <div data-slot="empty-state" className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-4 text-center">
      <span className="grid size-24 place-items-center rounded-full bg-md-secondary-container text-md-on-secondary-container">
        <Icon className="size-10" aria-hidden />
      </span>
      <Typography variant="headline">{title}</Typography>
      {description ? <Typography tone="muted">{description}</Typography> : null}
      {action}
    </div>
  )
}
