import { PageHeader } from '@/components/layout/PageHeader/PageHeader'
import { MovieBackground } from '@/components/movie/MovieBackground/MovieBackground'
import { MovieDescription } from '@/components/movie/MovieDescription/MovieDescription'
import { MoviePoster } from '@/components/movie/MoviePoster/MoviePoster'

import type { Film } from '@/types'

type PromoFilmProps = {
  promoFilm: Film
}

export const MoviePromo = ({ promoFilm }: PromoFilmProps) => {
  return (
    <section className="movie-card">
      <MovieBackground src={promoFilm.backgroundImage} name={promoFilm.name} />

      <h1 className="visually-hidden">WTW</h1>

      <PageHeader className="movie-card__head" />

      <div className="movie-card__wrap">
        <div className="movie-card__info">
          <MoviePoster src={promoFilm.posterImage} name={promoFilm.name} />
          <MovieDescription
            id={promoFilm.id}
            name={promoFilm.name}
            genre={promoFilm.genre}
            released={promoFilm.released}
            isFavorite={promoFilm.isFavorite}
          />
        </div>
      </div>
    </section>
  )
}
