import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'>

export const Button = ({ className, type = 'button', ...props }: ButtonProps) => {
  return <button className={className ? `btn ${className}` : 'btn'} type={type} {...props} />
}
