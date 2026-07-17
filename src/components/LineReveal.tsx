import type { CSSProperties } from 'react'

type LineRevealProps = {
  lines: string[]
  className?: string
  baseDelay?: number
  step?: number
  active?: boolean
}

/** Line-by-line parallax entrance (not character-by-character). */
export function LineReveal({
  lines,
  className = '',
  baseDelay = 0,
  step = 140,
  active = true,
}: LineRevealProps) {
  return (
    <div className={`line-reveal ${className}`.trim()} aria-label={lines.join(' ')}>
      {lines.map((line, index) => {
        const style = {
          transitionDelay: `${baseDelay + index * step}ms`,
          '--line-parallax': `${22 + index * 12}px`,
        } as CSSProperties

        return (
          <p
            key={`${line}-${index}`}
            className={`line-reveal__item${active ? ' is-active' : ''}`}
            style={style}
            aria-hidden="true"
          >
            {line}
          </p>
        )
      })}
    </div>
  )
}
