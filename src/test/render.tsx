import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'

import type { ReactElement } from 'react'
import type { RouteObject } from 'react-router'

type RenderOptions = {
  route?: string
  routes?: RouteObject[]
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', routes = [] }: RenderOptions = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const router = createMemoryRouter([{ path: route, element: ui }, ...routes], {
    initialEntries: [route],
  })

  return {
    user: userEvent.setup(),
    router,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}
