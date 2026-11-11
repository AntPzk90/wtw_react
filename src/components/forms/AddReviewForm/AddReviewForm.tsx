import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { RatingStars } from '@/components/forms/RatingStars/RatingStars'

import { post } from '@/api/request'
import { REVIEW_MAX_LENGTH, REVIEW_MIN_LENGTH } from '@/const'

import type { ChangeEvent, SubmitEvent } from 'react'
import type { Review, ReviewData } from '@/types'

const COMMENT_REGEXP = new RegExp(`^[\\s\\S]{${REVIEW_MIN_LENGTH},${REVIEW_MAX_LENGTH}}$`)

export const AddReviewForm = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isCommentValid = COMMENT_REGEXP.test(comment.trim())
  const isRatingValid = rating > 0
  const showCommentError = isSubmitted && !isCommentValid
  const showRatingError = isSubmitted && !isRatingValid

  const { id } = useParams()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ReviewData) => post<Review[]>(`/comments/${id}`, data),
    onSuccess: (comments) => {
      queryClient.setQueryData(['comments', Number(id)], comments)
      toast.success('Your review has been sent')
      navigate(`/films/${id}?tab=reviews`, { replace: true })
    },
    onError: () => toast.error('Could not send your review'),
  })

  const onRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value))
  }

  const onCommentFieldTyping = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(evt.target.value)
  }

  const onSubmitForm = (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setIsSubmitted(true)
    if (!isCommentValid || !isRatingValid) return
    mutate({ comment: comment.trim(), rating })
  }

  return (
    <div className="add-review">
      <form className="add-review__form" noValidate onSubmit={onSubmitForm}>
        <RatingStars value={rating} onRatingChange={onRatingChange} />

        <div className="add-review__text">
          <textarea
            id="review-text"
            className="add-review__textarea"
            name="review-text"
            placeholder="Review text"
            maxLength={REVIEW_MAX_LENGTH}
            value={comment}
            onChange={onCommentFieldTyping}
          ></textarea>
          <div className="add-review__submit">
            {showRatingError && <p>Please choose a rating</p>}
            {showCommentError && (
              <p>
                Review must be {REVIEW_MIN_LENGTH}–{REVIEW_MAX_LENGTH} characters
              </p>
            )}
            <button disabled={isPending} className="add-review__btn" type="submit">
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
