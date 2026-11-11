import { useParams } from 'react-router'

import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'
import { VideoPlayer } from '@/components/player/VideoPlayer/VideoPlayer'

import { useFilm } from '@/hooks/useFilm'

export const PlayerPage = () => {
  const { id } = useParams()

  const { data: film, isPending, isError } = useFilm(id)

  if (isError) return <NotFoundPage />
  if (isPending) return <div>Loading</div>

  return (
    <VideoPlayer
      id={film.id}
      videoLink={film.videoLink}
      name={film.name}
      posterImage={film.posterImage}
    />
  )
}
