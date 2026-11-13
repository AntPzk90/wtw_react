import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Toaster } from 'sonner'

import type { ReactElement } from 'react'
import type { RouteObject } from 'react-router'

type RenderOptions = {
  // URL the router starts on: '/films/1/review'
  route?: string
  // Route pattern for `ui`, when it differs from the URL: '/films/:id/review'
  // (needed for components that read useParams). Defaults to `route`.
  path?: string
  // Extra routes to land on after a redirect: [{ path: '/', element: <p>Home</p> }]
  routes?: RouteObject[]
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', path = route, routes = [] }: RenderOptions = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const router = createMemoryRouter([{ path, element: ui }, ...routes], {
    initialEntries: [route],
  })

  return {
    user: userEvent.setup(),
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* toast.success() / toast.error() show up here, so tests can find them by text */}
        <Toaster />
      </QueryClientProvider>,
    ),
  }
}
