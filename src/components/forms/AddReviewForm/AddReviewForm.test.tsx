import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'

import { AddReviewForm } from '@/components/forms/AddReviewForm/AddReviewForm'

import { renderWithProviders } from '@/test/render'
import { apiUrl, server } from '@/test/server'

const renderOnFilmRoute = () =>
  renderWithProviders(<AddReviewForm />, {
    route: '/films/1/review',
    path: '/films/:id/review',
    routes: [{ path: '/films/:id', element: <p>Film page</p> }],
  })

describe('AddReviewForm', () => {
  it('shows the length hint while the review is shorter than 10 characters', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.type(screen.getByLabelText('Review text'), '123456789')
    expect(screen.getByText('Review must be 10–400 characters')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Review text'), '0')
    expect(screen.queryByText('Review must be 10–400 characters')).not.toBeInTheDocument()
  })

  it('asks for a rating when the text is valid but no star is chosen', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.type(screen.getByLabelText('Review text'), '1234567890')
    expect(screen.queryByText('Review must be 10–400 characters')).not.toBeInTheDocument()
    expect(screen.getByText('Please choose a rating')).toBeInTheDocument()
  })

  it('enables Send when the text is valid and a star is chosen', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.type(screen.getByLabelText('Review text'), '1234567890')
    await user.click(screen.getByLabelText('Rating 2'))

    expect(screen.queryByText('Review must be 10–400 characters')).not.toBeInTheDocument()
    expect(screen.queryByText('Please choose a rating')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled()
  })

  it('fresh form: no hints, counter 0 / 400, button disabled', () => {
    renderWithProviders(<AddReviewForm />)

    expect(screen.getByText('0 / 400')).toBeInTheDocument()

    expect(screen.queryByText('Review must be 10–400 characters')).not.toBeInTheDocument()
    expect(screen.queryByText('Please choose a rating')).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('ignores leading and trailing spaces when counting characters', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.type(screen.getByLabelText('Review text'), '  ' + 'a'.repeat(9) + '  ')

    expect(screen.getByText('9 / 400')).toBeInTheDocument()
    expect(screen.getByText('Review must be 10–400 characters')).toBeInTheDocument()
  })

  it('accepts a 400-character review', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.click(screen.getByLabelText('Review text'))
    await user.paste('a'.repeat(400))

    expect(screen.getByText('400 / 400')).toBeInTheDocument()
    expect(screen.getByText('Please choose a rating')).toBeInTheDocument()
  })

  it('keeps Send disabled when a star is chosen but there is no text', async () => {
    const { user } = renderWithProviders(<AddReviewForm />)

    await user.click(screen.getByLabelText('Rating 3'))
    expect(screen.getByLabelText('Rating 3')).toBeChecked()

    expect(screen.getByText('0 / 400')).toBeInTheDocument()
    expect(screen.queryByText('Please choose a rating')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('shows a success toast and opens the film reviews after sending', async () => {
    const { user, router } = renderOnFilmRoute()

    await user.type(screen.getByLabelText('Review text'), 'This is a great movie!')
    await user.click(screen.getByLabelText('Rating 5'))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Your review has been sent')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/films/1')
    expect(router.state.location.search).toBe('?tab=reviews')
  })

  it('shows an error toast and stays on the form when the server fails', async () => {
    server.use(http.post(apiUrl('/comments/:id'), () => new HttpResponse(null, { status: 500 })))
    const { user, router } = renderOnFilmRoute()

    await user.type(screen.getByLabelText('Review text'), 'This is a great movie!')
    await user.click(screen.getByLabelText('Rating 5'))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Could not send your review')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/films/1/review')
    expect(screen.getByLabelText('Review text')).toHaveValue('This is a great movie!')
  })

  it('disables Send while the review is being sent', async () => {
    server.use(
      http.post(apiUrl('/comments/:id'), async () => {
        await delay(100)
        return new HttpResponse(null, { status: 500 })
      }),
    )
    const { user } = renderOnFilmRoute()
    const button = screen.getByRole('button', { name: 'Send' })

    await user.type(screen.getByLabelText('Review text'), 'This is a great movie!')
    await user.click(screen.getByLabelText('Rating 5'))
    await user.click(button)

    expect(button).toBeDisabled()
    await waitFor(() => {
      expect(button).toBeEnabled()
    })
  })
})
