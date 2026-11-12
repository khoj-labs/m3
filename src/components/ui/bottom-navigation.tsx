import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const bottomNavigationVariants = cva(
  "flex h-20 w-full items-stretch justify-around gap-2 bg-md-surface-container px-2 pt-3 pb-4",
  {
    variants: {
      position: { static: "", fixed: "fixed inset-x-0 bottom-0 z-40", sticky: "sticky bottom-0 z-40" },
    },
    defaultVariants: { position: "static" },
  }
)

/** M3 navigation bar. Built on Base UI Tabs for roving focus + selected state. */
function BottomNavigation({
  className,
  position,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof bottomNavigationVariants> & {
    defaultValue?: string
    onValueChange?: (value: string) => void
    value?: string
  }) {
  return (
    <TabsPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={(v) => onValueChange?.(v as string)}>
      <TabsPrimitive.List
        data-slot="bottom-navigation"
        aria-label="Primary"
        className={cn(bottomNavigationVariants({ position }), className)}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}

function BottomNavigationItem({
  className,
  icon,
  label,
  showLabel = true,
  badge,
  ...props
}: Omit<TabsPrimitive.Tab.Props, "children"> & {
  icon: React.ReactNode
  label: string
  badge?: React.ReactNode
  showLabel?: boolean
}) {
  return (
    <TabsPrimitive.Tab
      data-slot="bottom-navigation-item"
      aria-label={showLabel ? undefined : label}
      className={cn(
        "group/nav flex max-w-28 min-w-12 flex-1 flex-col items-center gap-1 rounded-xl text-xs font-medium text-md-on-surface-variant outline-none transition-colors duration-(--motion-duration-short) ease-standard focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 data-active:text-md-on-surface",
        className
      )}
      {...props}
    >
      <span className="relative flex h-8 w-16 items-center justify-center rounded-full transition-[background-color] duration-(--motion-duration-medium) ease-emphasized group-hover/nav:bg-md-on-surface/8 group-data-active/nav:bg-md-secondary-container group-data-active/nav:text-md-on-secondary-container [&_svg]:size-6">
        {icon}
        {badge != null && (
          <span className="absolute top-0 right-3 flex min-w-4 items-center justify-center rounded-full bg-md-error px-1 text-[10px] leading-4 text-md-on-error">
            {badge}
          </span>
        )}
      </span>
      {showLabel && <span>{label}</span>}
    </TabsPrimitive.Tab>
  )
}

export { BottomNavigation, BottomNavigationItem, bottomNavigationVariants }
