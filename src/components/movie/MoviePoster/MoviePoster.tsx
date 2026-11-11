// Size modifiers (movie-card__poster--big / --small) come from the page as className.
type MoviePosterProps = {
  className?: string
  src: string
  name: string
}

export const MoviePoster = ({ className = '', src, name }: MoviePosterProps) => {
  return (
    <div className={`movie-card__poster ${className}`}>
      <img src={src} alt={name} width="218" height="327" />
    </div>
  )
}
