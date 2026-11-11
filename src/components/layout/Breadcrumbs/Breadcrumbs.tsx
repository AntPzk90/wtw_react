import { Link } from 'react-router'

import type { Film } from '@/types'

type BreadcrumbsProps = Pick<Film, 'id' | 'name'>

export const Breadcrumbs = ({ id, name }: BreadcrumbsProps) => {
  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to={`/films/${id}`} className="breadcrumbs__link">
            {name}
          </Link>
        </li>
        <li className="breadcrumbs__item">
          <a className="breadcrumbs__link" aria-current="page">
            Add review
          </a>
        </li>
      </ul>
    </nav>
  )
}
