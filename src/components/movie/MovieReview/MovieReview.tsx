import { formatDateAttr, formatReviewDate } from '@/utils/date'

import type { Review } from '@/types'

type MovieReviewProps = Omit<Review, 'id'>

export const MovieReview = ({ user, comment, rating, date }: MovieReviewProps) => {
  return (
    <div className="review">
      <blockquote className="review__quote">
        <p className="review__text">{comment}</p>

        <footer className="review__details">
          <cite className="review__author">{user.name}</cite>
          <time className="review__date" dateTime={formatDateAttr(date)}>
            {formatReviewDate(date)}
          </time>
        </footer>
      </blockquote>

      <div className="review__rating">{rating}</div>
    </div>
  )
}
