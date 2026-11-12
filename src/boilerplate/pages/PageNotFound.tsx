import { FileQuestionIcon, HomeIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function PageNotFound({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-12 text-center">
      <FileQuestionIcon className="size-24 text-md-outline" aria-hidden />
      <Typography variant="headline">HTTP ERROR 404</Typography>
      <Typography tone="muted">The page you were looking for doesn't exist.</Typography>
      <Button size="lg" nativeButton={false} render={<Link to={homeHref} />}><HomeIcon data-icon="inline-start" />Take Me Home</Button>
    </div>
  )
}
