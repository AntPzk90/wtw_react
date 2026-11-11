import { MovieButtons } from '@/components/movie/MovieButtons/MovieButtons'

import type { Film } from '@/types'

type MovieDescriptionProps = Pick<Film, 'id' | 'name' | 'genre' | 'released' | 'isFavorite'>
export const MovieDescription = ({
  id,
  name,
  genre,
  released,
  isFavorite,
}: MovieDescriptionProps) => {
  return (
    <div className="movie-card__desc">
      <h2 className="movie-card__title">{name}</h2>
      <p className="movie-card__meta">
        <span className="movie-card__genre">{genre}</span>
        <span className="movie-card__year">{released}</span>
      </p>

      <MovieButtons id={id} isFavorite={isFavorite} />
    </div>
  )
}
