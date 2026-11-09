import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "cn"

const stepperVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
  },
  defaultVariants: { orientation: "horizontal" },
})

type StepDef = {
  label: string
  description?: string
  optional?: boolean
  error?: boolean
  completed?: boolean
  /** Rendered under the active step in vertical orientation. */
  content?: React.ReactNode
}

type StepStatus = "complete" | "active" | "error" | "upcoming"

function StepIndicator({ status, index }: { status: StepStatus; index: number }) {
  return (
    <span
      data-slot="step-indicator"
      data-status={status}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-(--motion-duration-medium) ease-standard [&_svg]:size-3.5",
        status === "upcoming" && "border-md-outline bg-transparent text-md-on-surface-variant",
        status === "active" && "border-md-primary bg-md-primary text-md-on-primary",
        status === "complete" && "border-md-primary bg-md-primary-container text-md-on-primary-container",
        status === "error" && "border-md-error bg-md-error text-md-on-error"
      )}
    >
      {status === "complete" ? <CheckIcon /> : status === "error" ? <XIcon /> : index + 1}
    </span>
  )
}

function Stepper({
  className,
  steps,
  activeStep,
  orientation = "horizontal",
  onStepClick,
  ...props
}: Omit<React.ComponentProps<"ol">, "children"> &
  VariantProps<typeof stepperVariants> & {
    steps: StepDef[]
    activeStep: number
    /** Makes steps clickable (non-linear stepper). */
    onStepClick?: (index: number) => void
  }) {
  const vertical = orientation === "vertical"
  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(stepperVariants({ orientation }), "m-0 list-none p-0", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status: StepStatus = step.error ? "error" : step.completed || i < activeStep ? "complete" : i === activeStep ? "active" : "upcoming"
        const last = i === steps.length - 1
        const Label = onStepClick ? "button" : "div"
        return (
          <li
            key={step.label}
            data-slot="step"
            data-status={status}
            aria-current={status === "active" ? "step" : undefined}
            className={cn("flex", vertical ? "flex-col" : "flex-1 items-start", last && !vertical && "flex-none")}
          >
            <div className={cn("flex items-center gap-3", !vertical && "w-full")}>
              <Label
                {...(onStepClick ? { type: "button" as const, onClick: () => onStepClick(i) } : {})}
                className={cn(
                  "flex items-center gap-3 rounded-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                  onStepClick && "cursor-pointer"
                )}
              >
                <StepIndicator status={status} index={i} />
                <span className="flex flex-col leading-tight">
                  <span className={cn("text-sm", status === "upcoming" ? "text-md-on-surface-variant" : "font-medium text-md-on-surface", status === "error" && "text-md-error")}>
                    {step.label}
                  </span>
                  {(step.optional || step.description) && (
                    <span className="text-xs text-md-on-surface-variant">{step.optional ? "Optional" : step.description}</span>
                  )}
                </span>
              </Label>
              {!vertical && !last && (
                <span aria-hidden className={cn("mx-2 h-px min-w-6 flex-1 transition-colors duration-(--motion-duration-long) ease-standard", i < activeStep ? "bg-md-primary" : "bg-md-outline-variant")} />
              )}
            </div>
            {vertical && (
              <div className="flex gap-3">
                <span aria-hidden className="flex w-6 justify-center">
                  {!last && <span className={cn("my-1 w-px", i < activeStep ? "bg-md-primary" : "bg-md-outline-variant")} />}
                </span>
                <div className={cn("grid transition-[grid-template-rows] duration-(--motion-duration-medium) ease-standard", status === "active" && step.content ? "grid-rows-[1fr]" : "grid-rows-[0fr]", "min-h-4 flex-1")}>
                  <div className="overflow-hidden">{step.content && <div className="py-2 text-sm">{step.content}</div>}</div>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper, StepIndicator, stepperVariants, type StepDef }
