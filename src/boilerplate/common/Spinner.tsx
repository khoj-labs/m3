import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

const spinnerVariants = cva("animate-spin text-primary", {
  variants: { size: { sm: "size-4", default: "size-8", lg: "size-12" } },
  defaultVariants: { size: "default" },
})

type SpinnerProps = React.ComponentProps<"div"> &
  VariantProps<typeof spinnerVariants> & {
    /** Centre in the viewport (upper third), like the original absolute spinner. */
    fullPage?: boolean
  }

export default function Spinner({ className, size, fullPage = false, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn(
        "flex items-center justify-center",
        fullPage ? "fixed top-[35%] left-1/2 -translate-x-1/2" : "w-full py-10",
        className
      )}
      {...props}
    >
      <Loader2Icon className={spinnerVariants({ size })} />
    </div>
  )
}

export { Spinner, spinnerVariants }
