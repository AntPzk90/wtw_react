import { Navigate, useLocation } from 'react-router'

import { useAuthStore } from '@/store/useAuthStore'

import type { ReactNode } from 'react'

type PrivateRouteProps = {
  children: ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
