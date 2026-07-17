import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: keyof HTMLElementTagNameMap
  style?: CSSProperties
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
  style,
}: RevealProps) {
  const Tag = as as 'div'
  return (
    <Tag
      className={`reveal ${className}`.trim()}
      data-reveal
      data-reveal-delay={delay}
      style={style}
    >
      {children}
    </Tag>
  )
}
