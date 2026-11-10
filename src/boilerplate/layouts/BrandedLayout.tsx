import type { ReactNode } from "react"
import { AppBar, AppBarLeading } from "@/components/ui/app-bar"

type Props = {
  children: ReactNode
  footer?: ReactNode
  logo?: ReactNode
}

/** Chrome for logged-out / marketing-style pages (the original `BrandingBorder`). */
export default function BrandedLayout({ logo, footer, children }: Props) {
  return (
    <>
      <AppBar position="fixed" color="transparent" className="h-(--layout-appbar-height)">
        <AppBarLeading>{logo}</AppBarLeading>
      </AppBar>
      <main className="mx-[5%] mt-[calc(var(--layout-appbar-height)+5%)] min-h-[450px]">{children}</main>
      {footer ? <footer className="mt-[5%]">{footer}</footer> : null}
    </>
  )
}
