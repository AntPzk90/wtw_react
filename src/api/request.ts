import { API_BASE } from '@/const'
import { useAuthStore } from '@/store/useAuthStore'

export class HttpError extends Error {
  status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = useAuthStore.getState().token
  const headers = new Headers(init?.headers)
  if (token) headers.set('X-Token', token)

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })

  if (!res.ok) {
    throw new HttpError(res.status)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json()
}

export const post = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: 'POST',
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })

export const del = <T>(path: string) =>
  request<T>(path, {
    method: 'DELETE',
  })
