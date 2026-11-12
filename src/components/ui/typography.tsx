import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"

/** M3 type scale. Each variant has a sensible default element (see `defaultTag`). */
const typographyVariants = cva("m-0", {
  variants: {
    variant: {
      display: "font-heading text-5xl leading-tight font-normal tracking-tight",
      headline: "font-heading text-3xl leading-tight font-normal",
      title: "font-heading text-xl leading-snug font-medium",
      subtitle: "text-base leading-snug font-medium tracking-wide",
      body: "text-sm leading-relaxed",
      "body-lg": "text-base leading-relaxed",
      label: "text-xs leading-none font-medium tracking-wider uppercase",
      caption: "text-xs leading-normal",
      code: "font-mono text-[0.85em] rounded-sm bg-muted px-1 py-0.5",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    },
    align: { left: "text-left", center: "text-center", right: "text-right" },
    noWrap: { true: "truncate", false: "" },
  },
  defaultVariants: { variant: "body", tone: "default", noWrap: false },
})

type Variant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>

const defaultTag: Record<Variant, "h1" | "h2" | "h3" | "h4" | "p" | "span" | "code"> = {
  display: "h1",
  headline: "h2",
  title: "h3",
  subtitle: "h4",
  body: "p",
  "body-lg": "p",
  label: "span",
  caption: "span",
  code: "code",
}

function Typography({
  className,
  variant = "body",
  tone,
  align,
  noWrap,
  as,
  render,
  ...props
}: Omit<useRender.ComponentProps<"p">, "ref"> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType
  }) {
  return useRender({
    defaultTagName: defaultTag[variant ?? "body"],
    props: mergeProps<"p">(
      {
        className: cn(typographyVariants({ variant, tone, align, noWrap }), className),
        // @ts-expect-error data-* attributes are valid on any element
        "data-slot": "typography",
        "data-variant": variant,
      },
      props
    ),
    render: render ?? (as ? React.createElement(as) : undefined),
  })
}

export { Typography, typographyVariants }
