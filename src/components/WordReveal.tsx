import { useEffect, useRef, useState } from 'react'
import { useDoubleRafReveal } from '../hooks/useDoubleRafReveal'

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
  const [inView, setInView] = useState(false)
  const contentKey = lines.join('\n')
  const show = useDoubleRafReveal(contentKey, active && inView)

  useEffect(() => {
    const node = rootRef.current
    if (!node || !active) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [active])

  let wordIndex = 0

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
                  style={{ transitionDelay: `${baseDelay + currentIndex * step}ms` }}
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
