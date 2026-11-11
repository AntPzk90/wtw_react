import { Link } from 'react-router'

import { PageFooter } from '@/components/layout/PageFooter/PageFooter'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'

import './NotFoundPage.css'

export const NotFoundPage = () => {
  return (
    <div className="user-page">
      <PageHeader className="user-page__head">
        <h1 className="page-title user-page__title">404. Page not found</h1>
      </PageHeader>

      <div className="user-page__content not-found">
        <p className="not-found__text">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn">
          Back to main page
        </Link>
      </div>

      <PageFooter />
    </div>
  )
}
