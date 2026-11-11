import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthInfo, User } from '@/types'

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (authInfo: AuthInfo) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (authInfo) => {
        const { token, ...user } = authInfo
        set({ token, user })
      },
      logout: () => {
        set({
          token: null,
          user: null,
        })
      },
    }),
    { name: 'wtw-auth' },
  ),
)
