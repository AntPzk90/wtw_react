import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

import { CatalogGenres } from '@/components/catalog/CatalogGenres/CatalogGenres'
import { CatalogMoviesList } from '@/components/catalog/CatalogMoviesList/CatalogMoviesList'
import { ShowMoreButton } from '@/components/catalog/ShowMoreButton/ShowMoreButton'
import { PageFooter } from '@/components/layout/PageFooter/PageFooter'
import { MoviePromo } from '@/components/movie/MoviePromo/MoviePromo'

import { request } from '@/api/request'

import type { Film, FilmsPage } from '@/types'

export const MainPage = () => {
  const [searchParams] = useSearchParams()
  const genre = searchParams.get('genre')

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['films', genre],
      queryFn: ({ pageParam }) => {
        const params = new URLSearchParams({ page: String(pageParam) })
        if (genre) params.set('genre', genre)
        return request<FilmsPage>(`/films?${params}`)
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
      placeholderData: keepPreviousData,
    })

  const {
    data: promoFilm,
    isPending: isPendingPromoFilm,
    isError: isErrorPromoFilm,
  } = useQuery({
    queryKey: ['promo'],
    queryFn: () => request<Film>('/promo'),
  })

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => request<string[]>('/genres'),
  })

  const films = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <>
      {promoFilm && <MoviePromo promoFilm={promoFilm} />}
      {isPendingPromoFilm && <div>Loading</div>}
      {isErrorPromoFilm && <div>Could not load the promo film</div>}

      <div className="page-content">
        <section className="catalog">
          <h2 className="catalog__title visually-hidden">Catalog</h2>
          {genres && <CatalogGenres genres={genres} activeGenre={genre} />}
          {isPending && <div>Loading</div>}
          {isError && <div>Could not load films</div>}
          {data && (
            <>
              <CatalogMoviesList films={films} />
              {hasNextPage && (
                <ShowMoreButton onBtnClick={() => fetchNextPage()} disabled={isFetchingNextPage} />
              )}
            </>
          )}
        </section>

        <PageFooter />
      </div>
    </>
  )
}
