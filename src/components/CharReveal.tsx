import { useEffect, useState } from 'react'

type CharRevealProps = {
  text: string
  className?: string
  baseDelay?: number
  step?: number
  active?: boolean
}

export function CharReveal({
  text,
  className = '',
  baseDelay = 0,
  step = 28,
  active = true,
}: CharRevealProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    if (!active) return

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true))
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [text, active])

  const chars = Array.from(text)
  const show = active && revealed

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
