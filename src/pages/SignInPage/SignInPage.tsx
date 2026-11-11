import { SignInForm } from '@/components/forms/SignInForm/SignInForm'
import { PageFooter } from '@/components/layout/PageFooter/PageFooter'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'

export const SignInPage = () => {
  return (
    <div className="user-page">
      <PageHeader className="user-page__head">
        <h1 className="page-title user-page__title">Sign in</h1>
      </PageHeader>

      <SignInForm />

      <PageFooter />
    </div>
  )
}
