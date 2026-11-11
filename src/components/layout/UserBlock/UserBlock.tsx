import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { del } from '@/api/request'
import { useAuthStore } from '@/store/useAuthStore'

export const UserBlock = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: () => del<void>('/logout'),
    onSuccess: () => toast.success('You logged out'),
    onError: () => toast.error('Something went wrong'),
    onSettled: () => {
      logout()
      queryClient.resetQueries()
    },
  })

  if (user === null) {
    return (
      <div className="user-block">
        <Link to="/login" className="user-block__link">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="user-block">
      <Link to="/mylist" className="user-block__avatar">
        <img src={user.avatarUrl} alt="User avatar" width="63" height="63" />
      </Link>
      <Link to="/" className="user-block__link" onClick={() => mutate()}>
        Sign out
      </Link>
    </div>
  )
}
