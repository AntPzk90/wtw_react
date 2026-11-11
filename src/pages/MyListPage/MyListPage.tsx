import { useQuery } from '@tanstack/react-query'

import { CatalogMoviesList } from '@/components/catalog/CatalogMoviesList/CatalogMoviesList'
import { PageFooter } from '@/components/layout/PageFooter/PageFooter'
import { PageHeader } from '@/components/layout/PageHeader/PageHeader'

import { request } from '@/api/request'

import type { Film } from '@/types'

export const MyListPage = () => {
  const {
    data: favoriteFilms,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['favorite'],
    queryFn: () => request<Film[]>('/favorite'),
  })

  return (
    <div className="user-page">
      <PageHeader className="user-page__head">
        <h1 className="page-title user-page__title">My list</h1>
      </PageHeader>

      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>
        {isPending && <div>Loading</div>}
        {isError && <div>Could not load films</div>}
        {favoriteFilms &&
          (favoriteFilms.length > 0 ? (
            <CatalogMoviesList films={favoriteFilms} />
          ) : (
            <div>Your list is empty</div>
          ))}
      </section>

      <PageFooter />
    </div>
  )
}
