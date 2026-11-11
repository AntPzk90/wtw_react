import { getRatingLevel } from '@/utils/rating'

import type { Film } from '@/types'

type MovieOverviewProps = Pick<
  Film,
  'rating' | 'scoresCount' | 'description' | 'director' | 'starring'
>

export const MovieOverview = ({
  rating,
  scoresCount,
  description,
  director,
  starring,
}: MovieOverviewProps) => {
  return (
    <>
      <div className="movie-rating">
        <div className="movie-rating__score">{rating.toFixed(1).replace('.', ',')}</div>
        <p className="movie-rating__meta">
          <span className="movie-rating__level">{getRatingLevel(rating)}</span>
          <span className="movie-rating__count">{scoresCount} ratings</span>
        </p>
      </div>

      <div className="movie-card__text">
        <p>{description}</p>

        <p className="movie-card__director">
          <strong>Director: {director}</strong>
        </p>

        <p className="movie-card__starring">
          <strong>
            Starring: {starring.slice(0, 4).join(', ')}
            {starring.length > 4 && ' and other'}
          </strong>
        </p>
      </div>
    </>
  )
}
