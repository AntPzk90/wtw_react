export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001'

export const MOVIE_TABS = ['overview', 'details', 'reviews'] as const
export const REVIEW_MIN_LENGTH = 10
export const REVIEW_MAX_LENGTH = 400
export const MAX_RATING = 5
