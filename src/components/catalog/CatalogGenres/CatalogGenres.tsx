import { Link } from 'react-router'

type GenresProps = {
  genres: string[]
  activeGenre: string | null
}

export const CatalogGenres = ({ genres, activeGenre }: GenresProps) => {
  return (
    <ul className="catalog__genres-list">
      <li
        className={`catalog__genres-item ${activeGenre === null ? 'catalog__genres-item--active' : ''}`}
      >
        <Link preventScrollReset to="/" className="catalog__genres-link">
          All genres
        </Link>
      </li>
      {genres.map((genre) => (
        <li
          key={genre}
          className={`catalog__genres-item ${activeGenre === genre ? 'catalog__genres-item--active' : ''}`}
        >
          <Link
            preventScrollReset
            to={{ search: `?${new URLSearchParams({ genre })}` }}
            className="catalog__genres-link"
          >
            {genre}
          </Link>
        </li>
      ))}
    </ul>
  )
}
