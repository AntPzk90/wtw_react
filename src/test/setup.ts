// Adds DOM matchers: toBeInTheDocument, toHaveValue, toBeDisabled, ...
import '@testing-library/jest-dom/vitest'

import { useAuthStore } from '@/store/useAuthStore'

// Every test starts logged out, with no auth left over from the previous one.
afterEach(() => {
  useAuthStore.setState({ token: null, user: null })
  localStorage.clear()
})
