import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const appBarVariants = cva("z-40 flex w-full items-center gap-2 px-4 transition-[background-color,box-shadow] duration-(--motion-duration-medium) ease-standard", {
  variants: {
    variant: {
      small: "h-16",
      "center-aligned": "h-16 justify-between [&>[data-slot=app-bar-title]]:text-center",
      medium: "min-h-28 flex-wrap content-between pt-2 pb-5",
      large: "min-h-38 flex-wrap content-between pt-2 pb-7",
    },
    color: {
      surface: "bg-md-surface text-md-on-surface",
      container: "bg-md-surface-container text-md-on-surface",
      primary: "bg-md-primary text-md-on-primary",
      transparent: "bg-transparent text-md-on-surface",
    },
    position: {
      static: "static",
      sticky: "sticky top-0",
      fixed: "fixed inset-x-0 top-0",
    },
    elevated: { true: "shadow-elevation-2", false: "" },
  },
  defaultVariants: { variant: "small", color: "surface", position: "static", elevated: false },
})

function AppBar({
  className,
  variant,
  color,
  position,
  elevated,
  ...props
}: React.ComponentProps<"header"> & VariantProps<typeof appBarVariants>) {
  return (
    <header
      data-slot="app-bar"
      data-variant={variant}
      className={cn(appBarVariants({ variant, color, position, elevated }), className)}
      {...props}
    />
  )
}

/** Title; grows to fill space. In medium/large bars it drops to its own row and gets bigger. */
function AppBarTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="app-bar-title"
      className={cn(
        "flex-1 truncate font-heading text-xl font-normal ",
        "[[data-variant=medium]_&]:order-last [[data-variant=medium]_&]:w-full [[data-variant=medium]_&]:text-2xl",
        "[[data-variant=large]_&]:order-last [[data-variant=large]_&]:w-full [[data-variant=large]_&]:text-4xl",
        className
      )}
      {...props}
    />
  )
}

function AppBarLeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-bar-leading" className={cn("flex items-center gap-1", className)} {...props} />
}

function AppBarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-bar-actions" className={cn("ml-auto flex items-center gap-1", className)} {...props} />
}

export { AppBar, AppBarTitle, AppBarLeading, AppBarActions, appBarVariants }
