/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // describe / it / expect / vi without imports, like in Jest
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Like Jest: vi.fn() call history is NOT reset between tests on its own.
    // Create mocks inside each `it`, or clear them with vi.clearAllMocks() in beforeEach.
    clearMocks: false,
  },
})
