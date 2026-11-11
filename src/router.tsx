import { createBrowserRouter } from 'react-router'

import { AddReviewPage } from '@/pages/AddReviewPage/AddReviewPage'
import { FilmPage } from '@/pages/FilmPage/FilmPage'
import { MainPage } from '@/pages/MainPage/MainPage'
import { MyListPage } from '@/pages/MyListPage/MyListPage'
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'
import { PlayerPage } from '@/pages/PlayerPage/PlayerPage'
import { SignInPage } from '@/pages/SignInPage/SignInPage'
import { GuestRoute } from '@/components/routing/GuestRoute/GuestRoute'
import { PrivateRoute } from '@/components/routing/PrivateRoute/PrivateRoute'
import { RootLayout } from '@/components/routing/RootLayout/RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/films/:id', element: <FilmPage /> },
      {
        path: '/films/:id/review',
        element: (
          <PrivateRoute>
            <AddReviewPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/mylist',
        element: (
          <PrivateRoute>
            <MyListPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <GuestRoute>
            <SignInPage />
          </GuestRoute>
        ),
      },
      { path: '/player/:id', element: <PlayerPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
