import { Link } from 'react-router'

import type { Film } from '@/types'

type SmallMovieCardProps = Pick<Film, 'id' | 'previewImage' | 'name'>

export const SmallMovieCard = ({ id, previewImage, name }: SmallMovieCardProps) => {
  return (
    <article className="small-movie-card catalog__movies-card">
      <div className="small-movie-card__image">
        <img src={previewImage} alt={name} width="280" height="175" />
      </div>
      <h3 className="small-movie-card__title">
        <Link className="small-movie-card__link" to={`/films/${id}`}>
          {name}
        </Link>
      </h3>
    </article>
  )
}
