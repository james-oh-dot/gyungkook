import { useEffect, useState, type RefObject } from 'react'

/**
 * Keeps an entrance animation visible after it has passed above the viewport,
 * but resets it when reverse scrolling moves it back below the viewport.
 * Re-entering from below then replays the entrance animation.
 */
export function useReversibleInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  threshold = 0.3,
  rootMargin = '0px 0px -10% 0px',
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true)
        else if (entry && entry.boundingClientRect.top >= window.innerHeight * 0.9) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    let raf = 0
    const resetBelowViewport = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (node.getBoundingClientRect().top >= window.innerHeight * 0.92) {
          setInView(false)
        }
      })
    }

    observer.observe(node)
    window.addEventListener('scroll', resetBelowViewport, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', resetBelowViewport)
      cancelAnimationFrame(raf)
    }
  }, [ref, rootMargin, threshold])

  return inView
}
