import { useParams } from 'react-router'

import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'
import { AddReviewForm } from '@/components/forms/AddReviewForm/AddReviewForm'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { MovieBackground } from '@/components/movie/MovieBackground/MovieBackground'
import { MoviePoster } from '@/components/movie/MoviePoster/MoviePoster'

import { useFilm } from '@/hooks/useFilm'

export const AddReviewPage = () => {
  const { id } = useParams()

  const { data: filmForReview, isPending, isError } = useFilm(id)

  if (isError) return <NotFoundPage />
  if (isPending) return <div>Loading</div>

  return (
    <section className="movie-card movie-card--full">
      <div className="movie-card__header">
        <MovieBackground src={filmForReview.backgroundImage} name={filmForReview.name} />

        <h1 className="visually-hidden">WTW</h1>

        <PageHeader>
          <Breadcrumbs id={filmForReview.id} name={filmForReview.name} />
        </PageHeader>

        <MoviePoster
          className="movie-card__poster--small"
          src={filmForReview.posterImage}
          name={filmForReview.name}
        />
      </div>

      <AddReviewForm />
    </section>
  )
}
