import { useQuery } from '@tanstack/react-query'

import { MovieReview } from '@/components/movie/MovieReview/MovieReview'

import { request } from '@/api/request'
import { splitInHalf } from '@/utils/splitHalf'

import type { Review } from '@/types'

type MovieReviewsProps = {
  id: number
}

export const MovieReviews = ({ id }: MovieReviewsProps) => {
  const {
    data: comments,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => request<Review[]>(`/comments/${id}`),
  })

  const [leftColumn, rightColumn] = splitInHalf(comments ?? [])

  return (
    <div className="movie-card__reviews movie-card__row">
      {comments && comments.length > 0 && (
        <>
          <div className="movie-card__reviews-col">
            {leftColumn.map((reviewLeft) => (
              <MovieReview key={reviewLeft.id} {...reviewLeft} />
            ))}
          </div>
          <div className="movie-card__reviews-col">
            {rightColumn.map((reviewRight) => (
              <MovieReview key={reviewRight.id} {...reviewRight} />
            ))}
          </div>
        </>
      )}
      {isPending && <div>Loading</div>}
      {isError && <div>Could not load comments</div>}
      {comments?.length === 0 && <div>No reviews yet</div>}
    </div>
  )
}
