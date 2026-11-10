import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { StarIcon } from "lucide-react"
import * as React from "react"

const ratingVariants = cva("inline-flex items-center gap-0.5 text-md-primary", {
  variants: {
    size: {
      sm: "[&_svg]:size-4",
      default: "[&_svg]:size-6",
      lg: "[&_svg]:size-8",
    },
  },
  defaultVariants: { size: "default" },
})

type RatingProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> &
  VariantProps<typeof ratingVariants> & {
    defaultValue?: number
    disabled?: boolean
    emptyIcon?: React.ReactNode
    icon?: React.ReactNode
    max?: number
    onValueChange?: (value: number) => void
    /** 1 = whole stars, 0.5 = half stars */
    precision?: 1 | 0.5
    readOnly?: boolean
    value?: number | null
  }

/**
 * Star rating. Keyboard accessible: arrow keys change value, Home/End jump to min/max.
 * Exposed to assistive tech as role="slider".
 */
function Rating({
  className,
  size,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  precision = 1,
  readOnly = false,
  disabled = false,
  icon,
  emptyIcon,
  ...props
}: RatingProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const [hover, setHover] = React.useState<number | null>(null)
  const value = valueProp ?? inner
  const shown = hover ?? value
  const interactive = !readOnly && !disabled

  const commit = (v: number) => {
    const next = Math.min(max, Math.max(0, v))
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  const valueFromPointer = (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (precision === 1) return index + 1
    const rect = e.currentTarget.getBoundingClientRect()
    return index + (e.clientX - rect.left < rect.width / 2 ? 0.5 : 1)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return
    const keys: Record<string, number> = {
      ArrowRight: value + precision,
      ArrowUp: value + precision,
      ArrowLeft: value - precision,
      ArrowDown: value - precision,
      Home: 0,
      End: max,
    }
    if (e.key in keys) {
      e.preventDefault()
      commit(keys[e.key])
    }
  }

  const filled = icon ?? <StarIcon fill="currentColor" />
  const empty = emptyIcon ?? <StarIcon className="text-md-outline" />

  return (
    <div
      data-slot="rating"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      className={cn(
        ratingVariants({ size }),
        "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        disabled && "opacity-40",
        className
      )}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, shown - i))
        return (
          <span
            key={i}
            data-slot="rating-item"
            onMouseMove={interactive ? (e) => setHover(valueFromPointer(e, i)) : undefined}
            onClick={interactive ? (e) => commit(valueFromPointer(e, i) === value ? 0 : valueFromPointer(e, i)) : undefined}
            className={cn(
              "relative inline-flex transition-transform duration-(--motion-duration-short) ease-emphasized",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            {empty}
            <span className="absolute inset-0 inline-flex overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <span className="inline-flex shrink-0">{filled}</span>
            </span>
          </span>
        )
      })}
    </div>
  )
}

export { Rating, ratingVariants }
