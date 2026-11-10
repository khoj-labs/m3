import { cn } from "cn"

/**
 * A box that contains `position: fixed` descendants (the transform makes it their containing
 * block), so AppShell, Header, SideNav, etc. render inline instead of covering the viewport.
 */
export default function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative overflow-hidden rounded-xl border border-border [transform:translateZ(0)]", className)}>{children}</div>
}
