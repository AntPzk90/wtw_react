import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button/Button'
import { ButtonLink } from '@/components/ui/ButtonLink/ButtonLink'

import { post } from '@/api/request'
import { useAuthStore } from '@/store/useAuthStore'

import type { Film } from '@/types'

type MovieButtonsProps = {
  id: number
  isFavorite: boolean
}

export const MovieButtons = ({ id, isFavorite }: MovieButtonsProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => post<Film>(`/favorite/${id}/${isFavorite ? 0 : 1}`),
    onSuccess: (film) => {
      queryClient.invalidateQueries({ queryKey: ['film'] })
      queryClient.invalidateQueries({ queryKey: ['promo'] })
      queryClient.invalidateQueries({ queryKey: ['favorite'] })
      toast.success(film.isFavorite ? 'Added to My list' : 'Removed from My list')
    },
    onError: () => toast.error('Something went wrong'),
  })

  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="movie-card__buttons">
      <ButtonLink to={`/player/${id}`} className="btn--play movie-card__button">
        <svg viewBox="0 0 19 19" width="19" height="19">
          <use href="#play-s" />
        </svg>
        <span>Play</span>
      </ButtonLink>
      <Button
        disabled={isPending}
        className="btn--list movie-card__button"
        onClick={() => (user ? mutate() : navigate('/login', { state: { from: location } }))}
      >
        <svg viewBox="0 0 19 20" width="19" height="20">
          <use href={isFavorite ? '#in-list' : '#add'} />
        </svg>
        <span>My list</span>
      </Button>
      <ButtonLink to={`/films/${id}/review`} className="movie-card__button">
        Add review
      </ButtonLink>
    </div>
  )
}
