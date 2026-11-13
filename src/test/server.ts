// Fake WTW API for tests (MSW). Requests from `request()` never reach the real server:
// MSW intercepts `fetch` and answers with the handlers below.
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { API_BASE } from '@/const'

import type { AuthData, AuthInfo, Review, ReviewData } from '@/types'

// Full URL for a handler: apiUrl('/login') → 'http://localhost:3001/login'
export const apiUrl = (path: string) => `${API_BASE}${path}`

// Default answers: the "happy path". A test overrides one with server.use(...),
// and setup.ts drops the override after the test.
export const handlers = [
  http.post(apiUrl('/login'), async ({ request }) => {
    const { email } = (await request.json()) as AuthData

    return HttpResponse.json<AuthInfo>({
      id: 1,
      name: email.split('@')[0],
      email,
      avatarUrl: 'img/avatar.jpg',
      token: btoa(email),
    })
  }),

  // Answers with the film's comment list, the new review included (like the real API).
  http.post(apiUrl('/comments/:id'), async ({ request }) => {
    const { comment, rating } = (await request.json()) as ReviewData

    return HttpResponse.json<Review[]>([
      {
        id: 1,
        user: { id: 1, name: 'test' },
        comment,
        rating,
        date: '2026-11-13T12:00:00.000Z',
      },
    ])
  }),
]

export const server = setupServer(...handlers)
