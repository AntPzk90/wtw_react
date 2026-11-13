import { screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'

import { MovieReviews } from '@/components/movie/MovieReviews/MovieReviews'

import { renderWithProviders } from '@/test/render'
import { apiUrl, server } from '@/test/server'

import type { Review } from '@/types'

const reviews: Review[] = [
  {
    id: 1,
    user: { id: 1, name: 'Anna' },
    comment: 'Great movie, watched it twice',
    rating: 5,
    date: '2026-11-01T12:00:00.000Z',
  },
  {
    id: 2,
    user: { id: 2, name: 'Oleg' },
    comment: 'Too long for me',
    rating: 2,
    date: '2026-11-02T12:00:00.000Z',
  },
]

describe('MovieReviews', () => {
  it('shows a loading state while the reviews are on the way', () => {
    // the answer never comes, so the query stays pending
    server.use(http.get(apiUrl('/comments/:id'), () => delay('infinite')))
    renderWithProviders(<MovieReviews id={1} />)

    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('shows the reviews once they are loaded', async () => {
    server.use(http.get(apiUrl('/comments/:id'), () => HttpResponse.json(reviews)))
    renderWithProviders(<MovieReviews id={1} />)

    expect(await screen.findByText('Great movie, watched it twice')).toBeInTheDocument()
    expect(screen.getByText('Too long for me')).toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })

  it('says there are no reviews when the list is empty', async () => {
    server.use(http.get(apiUrl('/comments/:id'), () => HttpResponse.json([])))
    renderWithProviders(<MovieReviews id={1} />)

    expect(await screen.findByText('No reviews yet')).toBeInTheDocument()
  })

  it('shows an error when the reviews could not be loaded', async () => {
    server.use(http.get(apiUrl('/comments/:id'), () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<MovieReviews id={1} />)

    expect(await screen.findByText('Could not load comments')).toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
})
