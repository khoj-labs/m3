import { cn } from "cn"

/** Right-aligned row of action buttons. */
export default function ActionButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" data-slot="action-button-group" className={cn("flex flex-wrap justify-end gap-2.5", className)} {...props} />
}
