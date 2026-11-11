import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { post } from '@/api/request'
import { useAuthStore } from '@/store/useAuthStore'

import type { SubmitEvent } from 'react'
import type { AuthData, AuthInfo } from '@/types'

const EMAIL_REGEXP = /^\S+@\S+\.\S+$/
const PASSWORD_REGEXP = /^(?=.*[a-zA-Z])(?=.*\d).+$/

export const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const showEmailError = isSubmitted && !EMAIL_REGEXP.test(email)
  const showPasswordError = isSubmitted && !PASSWORD_REGEXP.test(password)

  const setAuth = useAuthStore((state) => state.setAuth)

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: AuthData) => post<AuthInfo>('/login', data),
    onSuccess: (authInfo) => {
      setAuth(authInfo)
    },
  })

  const onSubmit = (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setIsSubmitted(true)
    if (!EMAIL_REGEXP.test(email) || !PASSWORD_REGEXP.test(password)) return
    mutate({ email, password })
  }

  return (
    <div className="sign-in user-page__content">
      <form className="sign-in__form" noValidate onSubmit={onSubmit}>
        {(showEmailError || showPasswordError) && (
          <div className="sign-in__message">
            {showEmailError && <p>Please enter a valid email address</p>}
            {showPasswordError && <p>Please enter a valid password</p>}
          </div>
        )}
        {isError && (
          <div className="sign-in__message">
            <p>Could not sign in. Check your email and password</p>
          </div>
        )}
        <div className="sign-in__fields">
          <div className={`sign-in__field ${showEmailError ? 'sign-in__field--error' : ''}`}>
            <input
              id="user-email"
              className="sign-in__input"
              type="email"
              placeholder="Email address"
              name="user-email"
              autoComplete="email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
            <label className="sign-in__label visually-hidden" htmlFor="user-email">
              Email address
            </label>
          </div>
          <div className={`sign-in__field ${showPasswordError ? 'sign-in__field--error' : ''}`}>
            <input
              id="user-password"
              className="sign-in__input"
              type="password"
              placeholder="Password"
              name="user-password"
              autoComplete="current-password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />
            <label className="sign-in__label visually-hidden" htmlFor="user-password">
              Password
            </label>
          </div>
        </div>
        <div className="sign-in__submit">
          <button disabled={isPending} className="sign-in__btn" type="submit">
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}
