import { Fragment, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export type TBreadcrumb = { icon?: ReactNode; label: string; href: string }

export default function BreadcrumbsNavigation({ items }: { items: TBreadcrumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => {
          const last = i === items.length - 1
          const content = (
            <span className="inline-flex items-center gap-1.5 [&_svg]:size-4">{item.icon}{item.label}</span>
          )
          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {last ? <BreadcrumbPage>{content}</BreadcrumbPage> : <BreadcrumbLink asChild><Link to={item.href}>{content}</Link></BreadcrumbLink>}
              </BreadcrumbItem>
              {!last && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
