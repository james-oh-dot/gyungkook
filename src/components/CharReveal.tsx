import { useDoubleRafReveal } from '../hooks/useDoubleRafReveal'

type CharRevealProps = {
  text: string
  className?: string
  baseDelay?: number
  step?: number
  active?: boolean
}

/**
 * Character-by-character reveal (hero maincopy).
 * Timing contract lives in `useDoubleRafReveal` — do not inline rAF logic here.
 */
export function CharReveal({
  text,
  className = '',
  baseDelay = 0,
  step = 28,
  active = true,
}: CharRevealProps) {
  const show = useDoubleRafReveal(text, active)

  const chars = Array.from(text)

  return (
    <span className={`char-reveal ${className}`.trim()} aria-label={text}>
      {chars.map((char, index) => (
        <span
          key={`${index}-${char}`}
          className={`char-reveal__item${show ? ' is-active' : ''}`}
          style={{ transitionDelay: `${baseDelay + index * step}ms` }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
