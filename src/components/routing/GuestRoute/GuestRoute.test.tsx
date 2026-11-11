import { act, screen } from '@testing-library/react'

import { GuestRoute } from '@/components/routing/GuestRoute/GuestRoute'
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

describe('GuestRoute', () => {
  it('shows the login page to a guest', () => {
    const { router } = renderWithProviders(
      <GuestRoute>
        <p>Login</p>
      </GuestRoute>,
      { route: '/login', routes: [{ path: '/', element: <p>Home</p> }] },
    )

    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('sends a logged-in user to /', () => {
    useAuthStore.getState().setAuth(authInfo)
    const { router } = renderWithProviders(
      <GuestRoute>
        <p>Login</p>
      </GuestRoute>,
      { route: '/login', routes: [{ path: '/', element: <p>Home</p> }] },
    )

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('returns a user to the page they came from after login', () => {
    const { router } = renderWithProviders(
      <PrivateRoute>
        <p>Private</p>
      </PrivateRoute>,
      {
        route: '/mylist',
        routes: [
          {
            path: '/login',
            element: (
              <GuestRoute>
                <p>Login</p>
              </GuestRoute>
            ),
          },
          { path: '/', element: <p>Home</p> },
        ],
      },
    )

    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByText('Login')).toBeInTheDocument()

    act(() => {
      useAuthStore.getState().setAuth(authInfo)
    })

    expect(router.state.location.pathname).toBe('/mylist')
    expect(screen.getByText('Private')).toBeInTheDocument()
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })
})
