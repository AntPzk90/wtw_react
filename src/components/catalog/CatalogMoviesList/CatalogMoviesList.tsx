import { SmallMovieCard } from '@/components/catalog/SmallMovieCard/SmallMovieCard'

import type { Film } from '@/types'

type CatalogMoviesListProps = {
  films?: Film[]
}

export const CatalogMoviesList = ({ films = [] }: CatalogMoviesListProps) => {
  return (
    <div className="catalog__movies-list">
      {films.map((film) => (
        <SmallMovieCard {...film} key={film.id} />
      ))}
    </div>
  )
}
