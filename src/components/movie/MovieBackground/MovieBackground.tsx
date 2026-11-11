type MovieBackgroundProps = {
  src: string
  name: string
}

export const MovieBackground = ({ src, name }: MovieBackgroundProps) => {
  return (
    <div className="movie-card__bg">
      <img src={src} alt={name} />
    </div>
  )
}
