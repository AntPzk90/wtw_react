import { Logo } from '@/components/layout/Logo/Logo'
import { UserBlock } from '@/components/layout/UserBlock/UserBlock'

import type { ReactNode } from 'react'

// Context modifiers (movie-card__head, user-page__head) come from the parent as className.
type PageHeaderProps = {
  className?: string
  children?: ReactNode
}

export const PageHeader = ({ className = '', children }: PageHeaderProps) => {
  return (
    <header className={`page-header ${className}`}>
      <Logo />
      {children}
      <UserBlock />
    </header>
  )
}
