import { screen } from '@testing-library/react'

import { PrivateRoute } from '@/components/routing/PrivateRoute/PrivateRoute'

import { useAuthStore } from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/render'

import type { AuthInfo } from '@/types'

const authInfo: AuthInfo = {
  id: 1,
  name: 'Anna',
  email: 'anna@test.com',
  avatarUrl: 'img/avatar.jpg',
  token: 'abc123',
}

describe('PrivateRoute', () => {
  it('redirects a guest to /login', () => {
    const { router } = renderWithProviders(
      <PrivateRoute>
        <p>Private</p>
      </PrivateRoute>,
      { route: '/mylist', routes: [{ path: '/login', element: <p>Login</p> }] },
    )

    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
  })

  it('lets a logged-in user through', () => {
    useAuthStore.getState().setAuth(authInfo)

    const { router } = renderWithProviders(
      <PrivateRoute>
        <p>Private</p>
      </PrivateRoute>,
      { route: '/mylist', routes: [{ path: '/login', element: <p>Login</p> }] },
    )

    expect(router.state.location.pathname).toBe('/mylist')
    expect(screen.getByText('Private')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
