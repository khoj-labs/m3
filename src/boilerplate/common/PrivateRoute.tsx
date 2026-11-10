import type { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Spinner from "./Spinner"

type Props = {
  /** Supply these from whatever auth you use; this component knows nothing about it. */
  isAuthenticated: boolean
  isLoading?: boolean
  redirectTo: string
  children?: ReactNode
}

/** Auth-agnostic route guard (replaces the Auth0-bound original). */
export default function PrivateRoute({ isAuthenticated, isLoading = false, redirectTo, children }: Props) {
  if (isLoading) return <Spinner fullPage />
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />
  return <>{children ?? <Outlet />}</>
}
