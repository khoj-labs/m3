import { createContext, useContext, useMemo, type ReactNode } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export type AppAlert = {
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number
}
type Ctx = { addAlert: (alert: AppAlert) => void }

const AppAlertsCtx = createContext<Ctx>({ addAlert: (a) => console.log(a) })

/**
 * Errors/warnings stay at top-right until dismissed;
 * success/info appear bottom-left for 5s.
 */
export default function AppAlerts({ children }: { children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      addAlert: ({ type, message, duration }) => {
        const sticky = type === "error" || type === "warning"
        duration = duration || sticky ? Infinity : 5000
        toast[type](message, {
          closeButton: true,
          duration,
          position: sticky ? "top-right" : "bottom-left",
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

export const useAppAlerts = () => useContext(AppAlertsCtx)
export { AppAlertsCtx }
