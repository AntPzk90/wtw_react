import { Outlet, ScrollRestoration } from 'react-router'

export const RootLayout = () => (
  <>
    <Outlet />
    <ScrollRestoration />
  </>
)
