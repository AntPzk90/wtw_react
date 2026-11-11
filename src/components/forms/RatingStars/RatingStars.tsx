import { Fragment } from 'react'

import { MAX_RATING } from '@/const'

import type { ChangeEvent } from 'react'

const STARS = Array.from({ length: MAX_RATING }, (_, index) => index + 1)

type RatingStarsProps = {
  value: number
  onRatingChange: (evt: ChangeEvent<HTMLInputElement>) => void
}

export const RatingStars = ({ value, onRatingChange }: RatingStarsProps) => {
  return (
    <div className="rating">
      <div className="rating__stars">
        {STARS.map((star) => (
          <Fragment key={star}>
            <input
              id={`star-${star}`}
              className="rating__input"
              type="radio"
              name="rating"
              value={star}
              checked={star === value}
              onChange={onRatingChange}
            />
            <label className="rating__label" htmlFor={`star-${star}`}>
              Rating {star}
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
