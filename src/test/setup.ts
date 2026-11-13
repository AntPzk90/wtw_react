// Adds DOM matchers: toBeInTheDocument, toHaveValue, toBeDisabled, ...
import '@testing-library/jest-dom/vitest'

import { useAuthStore } from '@/store/useAuthStore'
import { server } from './server'

// Fake API on for the whole run. A request without a handler fails the test,
// so a forgotten mock shows up right away instead of hitting the network.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterAll(() => server.close())

afterEach(() => {
  // drop handlers added with server.use(...) inside a test
  server.resetHandlers()
  // every test starts logged out, with no auth left over from the previous one
  useAuthStore.setState({ token: null, user: null })
  localStorage.clear()
})
