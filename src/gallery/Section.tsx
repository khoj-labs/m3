import type { ReactNode } from "react"
import { Typography } from "@/components/ui/typography"

/** `name` must match the file name in components/ui (see scripts/check-gallery.mjs). */
export function Section({ name, title, children }: { children: ReactNode; name: string; title: string }) {
  return (
    <section id={name} data-gallery={name} className="scroll-mt-20 border-b border-border py-8">
      <Typography variant="title" className="mb-4">{title}</Typography>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

export function Row({ label, children, className = "" }: { children: ReactNode; label: string; className?: string }) {
  return (
    <div>
      <Typography variant="label" tone="muted" className="mb-2 block">{label}</Typography>
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>
    </div>
  )
}
