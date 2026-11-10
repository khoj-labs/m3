import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { Fab } from "@/components/ui/fab"

const actionsVariants = cva("absolute flex items-center gap-3", {
  variants: {
    direction: {
      up: "bottom-full mb-3 flex-col-reverse",
      down: "top-full mt-3 flex-col",
      left: "right-full mr-3 flex-row-reverse",
      right: "left-full ml-3 flex-row",
    },
  },
  defaultVariants: { direction: "up" },
})

type SpeedDialAction = { icon: React.ReactNode; key: string; label: string; onSelect?: () => void }

type SpeedDialProps = Omit<React.ComponentProps<"div">, "onChange"> &
  VariantProps<typeof actionsVariants> & {
    actions: SpeedDialAction[]
    "aria-label"?: string
    defaultOpen?: boolean
    icon?: React.ReactNode
    onOpenChange?: (open: boolean) => void
    open?: boolean
    /** Open on hover as well as click/focus. */
    openOnHover?: boolean
  }

function SpeedDial({
  className,
  actions,
  direction = "up",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  icon,
  openOnHover = false,
  "aria-label": ariaLabel = "Actions",
  ...props
}: SpeedDialProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const id = React.useId()
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInner(v)
    onOpenChange?.(v)
  }
  const horizontal = direction === "left" || direction === "right"

  return (
    <div
      data-slot="speed-dial"
      data-state={open ? "open" : "closed"}
      className={cn("relative inline-flex", className)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onMouseEnter={openOnHover ? () => setOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setOpen(false) : undefined}
      {...props}
    >
      <Fab
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
      >
        <span className={cn("transition-transform duration-(--motion-duration-medium) ease-emphasized", open && "rotate-45")}>
          {icon ?? <PlusIcon />}
        </span>
      </Fab>
      <div id={id} role="menu" data-slot="speed-dial-actions" className={actionsVariants({ direction })}>
        {actions.map((a, i) => (
          <div
            key={a.key}
            className={cn(
              "flex items-center gap-2 transition-[opacity,transform] duration-(--motion-duration-medium) ease-emphasized",
              horizontal ? "flex-col" : "flex-row-reverse",
              open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"
            )}
            style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
          >
            <Fab
              role="menuitem"
              size="sm"
              variant="secondary"
              aria-label={a.label}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                a.onSelect?.()
                setOpen(false)
              }}
            >
              {a.icon}
            </Fab>
            <span className="rounded-md bg-md-surface-container-highest px-2 py-1 text-xs whitespace-nowrap text-md-on-surface shadow-elevation-1">
              {a.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { SpeedDial, type SpeedDialAction }
