import type { CSSProperties } from 'react'
import { useDoubleRafReveal } from '../hooks/useDoubleRafReveal'

type LineRevealProps = {
  lines: string[]
  className?: string
  baseDelay?: number
  step?: number
  active?: boolean
}

/**
 * Line-by-line parallax entrance (not character-by-character).
 * Timing contract lives in `useDoubleRafReveal` — the primitive `contentKey`
 * (joined lines) is what keeps hero rAF re-renders from resetting the reveal.
 */
export function LineReveal({
  lines,
  className = '',
  baseDelay = 0,
  step = 140,
  active = true,
}: LineRevealProps) {
  // Primitive key: parent may pass a new array each render (hero rAF setProgress)
  const show = useDoubleRafReveal(lines.join('\n'), active)

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
            className={`line-reveal__item${show ? ' is-active' : ''}`}
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
