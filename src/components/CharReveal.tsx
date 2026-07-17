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
  const chars = Array.from(text)

  return (
    <span className={`char-reveal ${className}`.trim()} aria-label={text}>
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`char-reveal__item${active ? ' is-active' : ''}`}
          style={{ transitionDelay: `${baseDelay + index * step}ms` }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
