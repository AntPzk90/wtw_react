import { useQuery } from '@tanstack/react-query'

import { request } from '@/api/request'

import type { Film } from '@/types'

export const useFilm = (id: string | undefined) =>
  useQuery({
    queryKey: ['film', id],
    queryFn: () => request<Film>(`/films/${id}`),
  })
