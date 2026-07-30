import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: keyof HTMLElementTagNameMap
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>

export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
  style,
  ...rest
}: RevealProps) {
  const Tag = as as 'div'
  return (
    <Tag
      className={`reveal ${className}`.trim()}
      data-reveal
      data-reveal-delay={delay}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
