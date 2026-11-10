import { createContext, useContext, useMemo, type ReactNode } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export type AppAlert = { type: "success" | "info" | "warning" | "error"; message: string }
type Ctx = { addAlert: (alert: AppAlert) => void }

const AppAlertsCtx = createContext<Ctx>({ addAlert: (a) => console.log(a) })

/**
 * Same `addAlert` API as the original, now backed by Sonner (so the original Toast
 * component is not needed). Errors/warnings stay at top-right until dismissed;
 * success/info appear bottom-left for 5s.
 */
export default function AppAlerts({ children }: { children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      addAlert: ({ type, message }) => {
        const sticky = type === "error" || type === "warning"
        toast[type](message, {
          position: sticky ? "top-right" : "bottom-left",
          duration: sticky ? Infinity : 5000,
          closeButton: true,
        })
      },
    }),
    []
  )
  return (
    <AppAlertsCtx.Provider value={value}>
      {children}
      <Toaster />
    </AppAlertsCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppAlerts = () => useContext(AppAlertsCtx)
export { AppAlertsCtx }
