import { Typography } from "@/components/ui/typography"

export default function GroupHeading({ description, id, index, title }: { description: string; id: string; index: number; title: string }) {
  return (
    <div id={id} className="scroll-mt-20 pt-12">
      <Typography variant="headline" className="flex items-baseline gap-3">
        <span className="text-md-primary">{index}</span>
        {title}
      </Typography>
      <Typography tone="muted" className="mt-1">{description}</Typography>
    </div>
  )
}
