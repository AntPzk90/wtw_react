import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'

import { SignInForm } from '@/components/forms/SignInForm/SignInForm'

import { useAuthStore } from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/render'
import { apiUrl, server } from '@/test/server'

describe('SignInForm', () => {
  it('hides errors until the form is submitted', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna')

    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    expect(screen.queryByText('Please enter a valid password')).not.toBeInTheDocument()
  })

  it('shows both errors when submitting an empty form', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid password')).toBeInTheDocument()
  })

  it('shows only the email error for an invalid email', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna')
    await user.type(screen.getByLabelText('Password'), 'abc123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.queryByText('Please enter a valid password')).not.toBeInTheDocument()
  })

  it('shows only the password error when it has no digit', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    expect(screen.getByText('Please enter a valid password')).toBeInTheDocument()
  })

  it('shows only the password error when it has no letter', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    expect(screen.getByText('Please enter a valid password')).toBeInTheDocument()
  })

  it('hides the email error once the email is fixed', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna')
    await user.type(screen.getByLabelText('Password'), 'abc123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.queryByText('Please enter a valid password')).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Email address'))
    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')

    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    expect(screen.queryByText('Please enter a valid password')).not.toBeInTheDocument()
  })

  it('logs the user in with valid data', async () => {
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'abc123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(useAuthStore.getState().user?.email).toBe('anna@gmail.com')
    })
  })

  it('shows an error when the server rejects the login', async () => {
    server.use(http.post(apiUrl('/login'), () => new HttpResponse(null, { status: 400 })))
    const { user } = renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'abc123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      await screen.findByText('Could not sign in. Check your email and password'),
    ).toBeInTheDocument()
  })

  it('disables the button while the request is pending', async () => {
    server.use(
      http.post(apiUrl('/login'), async () => {
        await delay(100)
        return new HttpResponse(null, { status: 400 })
      }),
    )
    const { user } = renderWithProviders(<SignInForm />)
    const button = screen.getByRole('button', { name: 'Sign in' })

    await user.type(screen.getByLabelText('Email address'), 'anna@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'abc123')
    await user.click(button)

    expect(button).toBeDisabled()
    await waitFor(() => {
      expect(button).toBeEnabled()
    })
  })
})
