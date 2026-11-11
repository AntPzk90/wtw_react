import { useAuthStore } from '@/store/useAuthStore'

import type { AuthInfo } from '@/types'

const authInfo: AuthInfo = {
  id: 1,
  name: 'Anna',
  email: 'anna@test.com',
  avatarUrl: 'img/avatar.jpg',
  token: 'abc123',
}

describe('useAuthStore', () => {
  it('starts as a guest', () => {
    const { token, user } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
  })

  it('saves token from setAuth', () => {
    useAuthStore.getState().setAuth(authInfo)
    expect(useAuthStore.getState().token).toBe('abc123')
  })

  it('saves the user without the token', () => {
    useAuthStore.getState().setAuth(authInfo)
    expect(useAuthStore.getState().user).toEqual({
      id: 1,
      name: 'Anna',
      email: 'anna@test.com',
      avatarUrl: 'img/avatar.jpg',
    })
  })

  it('clears the token and the user on logout', () => {
    useAuthStore.getState().setAuth(authInfo)
    useAuthStore.getState().logout()
    const { token, user } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})
