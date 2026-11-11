import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { toast, Toaster } from 'sonner'

import { SvgSprite } from '@/components/ui/SvgSprite/SvgSprite'

import { HttpError } from '@/api/request'
import { router } from './router'

import type { ToasterProps } from 'sonner'

import '@/styles/main.css'
import '@/styles/toast.css'

const toastOptions: ToasterProps['toastOptions'] = {
  classNames: { toast: 'toast', success: 'toast--success', error: 'toast--error' },
}

const isClientError = (error: Error) =>
  error instanceof HttpError && error.status >= 400 && error.status < 500

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (!isClientError(error)) toast.error('Could not load data')
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
    },
  },
})

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SvgSprite />
        <Toaster theme="dark" duration={2500} position="top-left" toastOptions={toastOptions} />
        <RouterProvider router={router} />
        <ReactQueryDevtools buttonPosition="top-right" />
      </QueryClientProvider>
    </>
  )
}
