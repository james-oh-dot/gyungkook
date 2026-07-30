import { useRef } from 'react'
import { useDoubleRafReveal } from '../hooks/useDoubleRafReveal'
import { useReversibleInView } from '../hooks/useReversibleInView'

type WordRevealProps = {
  lines: string[]
  className?: string
  baseDelay?: number
  step?: number
  active?: boolean
}

export function WordReveal({
  lines,
  className = '',
  baseDelay = 0,
  step = 110,
  active = true,
}: WordRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useReversibleInView(rootRef)
  const contentKey = lines.join('\n')
  const show = useDoubleRafReveal(contentKey, active && inView)

  let wordIndex = 0
  const wordCount = lines.reduce((count, line) => count + line.split(/\s+/).length, 0)

  return (
    <div
      ref={rootRef}
      className={`word-reveal ${className}`.trim()}
      aria-label={lines.join(' ')}
    >
      {lines.map((line) => (
        <p key={line} aria-hidden="true">
          {line.split(/\s+/).map((word, index, words) => {
            const currentIndex = wordIndex
            wordIndex += 1
            return (
              <span key={`${currentIndex}-${word}`}>
                <span
                  className={`word-reveal__word${show ? ' is-active' : ''}`}
                  style={{
                    transitionDelay: `${
                      show
                        ? baseDelay + currentIndex * step
                        : (wordCount - currentIndex - 1) * Math.min(step, 55)
                    }ms`,
                  }}
                >
                  {word}
                </span>
                {index < words.length - 1 ? ' ' : null}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}
