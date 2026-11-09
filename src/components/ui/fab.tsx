import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const fabVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap shadow-elevation-3 transition-[box-shadow,background-color,transform] duration-(--motion-duration-short) ease-standard outline-none select-none hover:shadow-elevation-2 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        primary: "bg-md-primary-container text-md-on-primary-container",
        secondary: "bg-md-secondary-container text-md-on-secondary-container",
        tertiary: "bg-md-tertiary-container text-md-on-tertiary-container",
        surface: "bg-md-surface-container-high text-md-primary",
        solid: "bg-md-primary text-md-on-primary",
      },
      size: {
        sm: "size-10 rounded-lg [&_svg:not([class*='size-'])]:size-5",
        default: "size-14 rounded-xl",
        lg: "size-24 rounded-2xl [&_svg:not([class*='size-'])]:size-9",
      },
      extended: {
        true: "w-auto rounded-xl px-4 text-sm tracking-wide",
        false: "",
      },
    },
    compoundVariants: [
      { extended: true, size: "sm", className: "h-10" },
      { extended: true, size: "default", className: "h-14" },
      { extended: true, size: "lg", className: "h-24 px-6 text-base" },
    ],
    defaultVariants: { variant: "primary", size: "default", extended: false },
  }
)

function Fab({
  className,
  variant,
  size,
  extended = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  Omit<VariantProps<typeof fabVariants>, "extended"> & {
    /** Show a text label next to the icon. */
    extended?: boolean
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="fab"
      data-variant={variant}
      data-size={size}
      className={cn(fabVariants({ variant, size, extended }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Fab, fabVariants }
