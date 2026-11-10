import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

/** A plain surface. Elevation is expressed through tonal surface + shadow tokens. */
const paperVariants = cva("text-foreground transition-shadow", {
  variants: {
    elevation: {
      0: "bg-md-surface shadow-none",
      1: "bg-md-surface-container-low shadow-elevation-1",
      2: "bg-md-surface-container shadow-elevation-2",
      3: "bg-md-surface-container-high shadow-elevation-3",
    },
    variant: {
      elevated: "",
      outlined: "border border-md-outline-variant shadow-none",
      filled: "bg-md-surface-container-highest shadow-none",
    },
    shape: {
      square: "rounded-none",
      rounded: "rounded-xl",
      large: "rounded-2xl",
    },
  },
  defaultVariants: { elevation: 1, variant: "elevated", shape: "rounded" },
})

function Paper({
  className,
  elevation,
  variant,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof paperVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="paper"
      className={cn(paperVariants({ elevation, variant, shape }), className)}
      {...props}
    />
  )
}

export { Paper, paperVariants }
