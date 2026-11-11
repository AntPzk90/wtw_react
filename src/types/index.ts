import { MOVIE_TABS } from '@/const'

export type Film = {
  id: number
  name: string
  posterImage: string
  previewImage: string
  backgroundImage: string
  videoLink: string
  description: string
  rating: number
  scoresCount: number
  director: string
  starring: string[]
  runTime: number
  genre: string
  released: number
  isFavorite: boolean
}

export type FilmsPage = {
  items: Film[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export type User = {
  avatarUrl: string
  email: string
  id: number
  name: string
}

export type AuthInfo = User & { token: string }

export type ReviewAuthor = {
  id: number
  name: string
}

export type Review = {
  id: number
  user: ReviewAuthor
  comment: string
  rating: number
  date: string
}

export type AuthData = {
  email: string
  password: string
}

export type ReviewData = {
  rating: number
  comment: string
}

export type MovieTab = (typeof MOVIE_TABS)[number]
