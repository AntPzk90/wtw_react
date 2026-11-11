import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router'

import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'
import { CatalogMoviesList } from '@/components/catalog/CatalogMoviesList/CatalogMoviesList'
import { PageFooter } from '@/components/layout/PageFooter/PageFooter'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { MovieBackground } from '@/components/movie/MovieBackground/MovieBackground'
import { MovieDescription } from '@/components/movie/MovieDescription/MovieDescription'
import { MovieDetails } from '@/components/movie/MovieDetails/MovieDetails'
import { MovieOverview } from '@/components/movie/MovieOverview/MovieOverview'
import { MoviePoster } from '@/components/movie/MoviePoster/MoviePoster'
import { MovieReviews } from '@/components/movie/MovieReviews/MovieReviews'
import { MovieTabs } from '@/components/movie/MovieTabs/MovieTabs'

import { request } from '@/api/request'
import { MOVIE_TABS } from '@/const'
import { useFilm } from '@/hooks/useFilm'

import type { Film, MovieTab } from '@/types'

const isMovieTab = (value: string | null): value is MovieTab =>
  (MOVIE_TABS as readonly (string | null)[]).includes(value)

export const FilmPage = () => {
  const { id } = useParams()

  const { data: film, isPending, isError } = useFilm(id)

  const { data: similarFilms = [] } = useQuery({
    queryKey: ['film', id, 'similar'],
    queryFn: () => request<Film[]>(`/films/${id}/similar`),
  })

  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: MovieTab = isMovieTab(tabParam) ? tabParam : 'overview'

  if (isError) return <NotFoundPage />
  if (isPending) return <div>Loading</div>

  return (
    <>
      <section className="movie-card movie-card--full">
        <div className="movie-card__hero">
          <MovieBackground src={film.backgroundImage} name={film.name} />

          <h1 className="visually-hidden">WTW</h1>

          <PageHeader className="movie-card__head" />

          <div className="movie-card__wrap">
            <MovieDescription
              id={film.id}
              name={film.name}
              genre={film.genre}
              released={film.released}
              isFavorite={film.isFavorite}
            />
          </div>
        </div>

        <div className="movie-card__wrap movie-card__translate-top">
          <div className="movie-card__info">
            <MoviePoster
              className="movie-card__poster--big"
              src={film.posterImage}
              name={film.name}
            />

            <div className="movie-card__desc">
              <MovieTabs activeTab={activeTab} />
              {activeTab === 'overview' && (
                <MovieOverview
                  rating={film.rating}
                  scoresCount={film.scoresCount}
                  description={film.description}
                  director={film.director}
                  starring={film.starring}
                />
              )}
              {activeTab === 'details' && (
                <MovieDetails
                  director={film.director}
                  starring={film.starring}
                  runTime={film.runTime}
                  genre={film.genre}
                  released={film.released}
                />
              )}
              {activeTab === 'reviews' && <MovieReviews id={film.id} />}
            </div>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>

          <CatalogMoviesList films={similarFilms} />
        </section>

        <PageFooter />
      </div>
    </>
  )
}
