import { Link } from 'react-router'

import type { LinkProps } from 'react-router'

export const ButtonLink = ({ className, ...props }: LinkProps) => {
  return <Link className={className ? `btn ${className}` : 'btn'} {...props} />
}
