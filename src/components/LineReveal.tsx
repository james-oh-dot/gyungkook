import { useEffect, useState, type CSSProperties } from 'react'

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
  const [revealed, setRevealed] = useState(false)
  // Primitive key: parent may pass a new array each render (hero rAF setProgress)
  const contentKey = lines.join('\n')

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
  }, [contentKey, active])

  const show = active && revealed

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
