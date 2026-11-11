import { Link } from 'react-router'

type LogoProps = {
  isLight?: boolean
}

export const Logo = ({ isLight = false }: LogoProps) => {
  return (
    <div className="logo">
      <Link to="/" className={`logo__link ${isLight ? 'logo__link--light' : ''}`}>
        <span className="logo__letter logo__letter--1">W</span>
        <span className="logo__letter logo__letter--2">T</span>
        <span className="logo__letter logo__letter--3">W</span>
      </Link>
    </div>
  )
}
