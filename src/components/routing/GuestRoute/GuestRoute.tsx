import { Navigate, useLocation } from 'react-router'

import { useAuthStore } from '@/store/useAuthStore'

import type { ReactNode } from 'react'

type GuestRouteProps = {
  children: ReactNode
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const from = (location.state as { from?: Location } | null)?.from ?? '/'

  if (user) return <Navigate to={from} replace />
  return children
}
