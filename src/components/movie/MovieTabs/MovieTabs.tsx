import { Link } from 'react-router'

import { MOVIE_TABS } from '@/const'

import type { MovieTab } from '@/types'

type MovieTabsProps = {
  activeTab: MovieTab
}

export const MovieTabs = ({ activeTab }: MovieTabsProps) => {
  return (
    <nav className="movie-nav movie-card__nav">
      <ul className="movie-nav__list">
        {MOVIE_TABS.map((movieTab) => (
          <li
            className={`movie-nav__item ${movieTab === activeTab ? 'movie-nav__item--active' : ''}`}
            key={movieTab}
          >
            <Link
              preventScrollReset
              replace
              to={{ search: `?tab=${movieTab}` }}
              className="movie-nav__link"
            >
              {movieTab}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
