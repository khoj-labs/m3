import { createContext, useContext, useMemo, type ReactNode } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Logger } from "../utils/logger"

export type AppAlert = {
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number
}
type Ctx = { addAlert: (alert: AppAlert) => void }

const AppAlertsCtx = createContext<Ctx>({
  addAlert: (alert) => Logger.warn("ALERTS-NO-PROVIDER: addAlert called outside <AppAlerts>", alert),
})

/**
 * Errors/warnings stay at top-right until dismissed;
 * success/info appear bottom-left for 5s.
 */
export default function AppAlerts({ children }: { children: ReactNode }) {
  const value = useMemo<Ctx>(
    () => ({
      addAlert: ({ type, message, duration }) => {
        const sticky = type === "error" || type === "warning"
        toast[type](message, {
          closeButton: true,
          duration: duration ?? (sticky ? Infinity : 5000),
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
