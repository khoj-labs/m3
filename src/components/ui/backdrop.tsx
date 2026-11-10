import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

const backdropVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-(--motion-duration-medium) ease-standard",
  {
    variants: {
      tone: {
        scrim: "bg-md-scrim",
        dark: "bg-black/60",
        blur: "bg-md-scrim backdrop-blur-sm",
      },
      open: {
        true: "opacity-100",
        false: "pointer-events-none opacity-0",
      },
    },
    defaultVariants: { tone: "scrim", open: false },
  }
)

/** Full-screen scrim that fades in/out. Children (e.g. a spinner) are centred. */
function Backdrop({
  className,
  open = false,
  tone,
  invisible,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "open"> &
  Omit<VariantProps<typeof backdropVariants>, "open"> & {
    /** Transparent, but still blocks interaction (like MUI `invisible`). */
    invisible?: boolean
    open?: boolean
  }) {
  return (
    <div
      data-slot="backdrop"
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      className={cn(backdropVariants({ tone, open }), invisible && "bg-transparent backdrop-blur-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Backdrop, backdropVariants }
