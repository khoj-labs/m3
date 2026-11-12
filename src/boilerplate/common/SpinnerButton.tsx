import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = React.ComponentProps<typeof Button> & { isLoading?: boolean }

/** A Button that disables itself and shows a spinner while `isLoading`. */
export default function SpinnerButton({ isLoading = false, children, disabled, ...props }: Props) {
  return (
    <Button disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
      {isLoading && !props.render ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
      {children}
    </Button>
  )
}
