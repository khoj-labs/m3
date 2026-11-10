import { cn } from "cn"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import BreadcrumbsNavigation, { type TBreadcrumb } from "./BreadcrumbsNavigation"

type Props = {
  title: string
  breadcrumbs?: TBreadcrumb[]
  className?: string
  createLabel?: string
  /** Shows a "Create New" button linking here. */
  createLink?: string
  Icon?: LucideIcon
  subtitle?: string
}

export default function PageHeader({ title, subtitle, Icon, createLink, createLabel = "Create New", breadcrumbs, className }: Props) {
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Typography as="h1" variant="headline" className="flex items-center gap-3">
          {Icon ? <Icon className="size-8 text-primary" aria-hidden /> : null}
          {title}
        </Typography>
        {createLink ? (
          <Button asChild><Link to={createLink}>{createLabel}</Link></Button>
        ) : null}
      </div>
      <div role="separator" className="h-[3px] rounded-full bg-md-outline-variant" />
      {breadcrumbs ? <div className="flex justify-end"><BreadcrumbsNavigation items={breadcrumbs} /></div> : null}
      {subtitle ? <Typography variant="title" tone="primary" className="ml-5">{subtitle}</Typography> : null}
    </header>
  )
}
