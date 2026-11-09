import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

function List({ className, dense, ...props }: React.ComponentProps<"ul"> & { dense?: boolean }) {
  return (
    <ul
      data-slot="list"
      data-dense={dense || undefined}
      className={cn("m-0 flex list-none flex-col gap-0.5 p-0 py-1", className)}
      {...props}
    />
  )
}

const listItemVariants = cva(
  "group/list-item relative flex w-full items-center gap-4 rounded-xl px-4 py-2 text-left text-sm outline-none transition-colors duration-(--motion-duration-short) ease-standard group-data-[dense]/list:py-1 data-[dense]:py-1",
  {
    variants: {
      interactive: {
        true: "cursor-pointer hover:bg-md-on-surface/8 focus-visible:bg-md-on-surface/12 focus-visible:ring-2 focus-visible:ring-ring/60 active:bg-md-on-surface/12",
        false: "",
      },
      selected: {
        true: "bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary-container",
        false: "",
      },
      disabled: { true: "pointer-events-none opacity-40", false: "" },
    },
    defaultVariants: { interactive: false, selected: false, disabled: false },
  }
)

/**
 * Renders an <li> row. With `asChild`, the single child (a <button> or <a>)
 * becomes the interactive row inside the <li>.
 */
function ListItem({
  className,
  interactive,
  selected,
  disabled,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"li"> &
  VariantProps<typeof listItemVariants> & { asChild?: boolean }) {
  if (asChild) {
    return (
      <li data-slot="list-item" className="list-none" {...props}>
        <Slot.Root
          aria-current={selected ? "true" : undefined}
          aria-disabled={disabled || undefined}
          className={cn(listItemVariants({ interactive: interactive ?? true, selected, disabled }), className)}
        >
          {children}
        </Slot.Root>
      </li>
    )
  }
  return (
    <li
      data-slot="list-item"
      aria-current={selected ? "true" : undefined}
      className={cn(listItemVariants({ interactive, selected, disabled }), className)}
      {...props}
    >
      {children}
    </li>
  )
}

function ListItemIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="list-item-icon"
      className={cn("flex size-6 shrink-0 items-center justify-center text-md-on-surface-variant [&_svg]:size-5 group-aria-[current=true]/list-item:text-md-on-secondary-container", className)}
      {...props}
    />
  )
}

function ListItemText({
  primary,
  secondary,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <span data-slot="list-item-text" className={cn("flex min-w-0 flex-1 flex-col", className)} {...props}>
      <span className="truncate text-base leading-6">{primary}</span>
      {secondary && <span className="truncate text-sm text-md-on-surface-variant">{secondary}</span>}
    </span>
  )
}

function ListItemTrailing({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="list-item-trailing" className={cn("ml-auto flex shrink-0 items-center gap-2 text-xs text-md-on-surface-variant", className)} {...props} />
  )
}

function ListSubheader({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="list-subheader" role="presentation" className={cn("list-none px-4 pt-3 pb-1 text-sm font-medium text-md-primary", className)} {...props} />
  )
}

function ListDivider({ className, inset, ...props }: React.ComponentProps<"li"> & { inset?: boolean }) {
  return (
    <li data-slot="list-divider" role="separator" className={cn("my-1 h-px list-none bg-md-outline-variant", inset ? "ml-14" : "mx-0", className)} {...props} />
  )
}

export { List, ListItem, ListItemIcon, ListItemText, ListItemTrailing, ListSubheader, ListDivider, listItemVariants }
