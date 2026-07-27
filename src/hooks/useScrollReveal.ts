import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const parallaxNodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.media-card__img, .hero__bg-slide img, [data-reveal], [data-parallax]',
      ),
    )
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealTimers = new Map<HTMLElement, number>()
    const resetReveal = (el: HTMLElement) => {
      const activeTimer = revealTimers.get(el)
      if (activeTimer !== undefined) {
        window.clearTimeout(activeTimer)
        revealTimers.delete(el)
      }
      el.classList.remove('is-revealed')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const activeTimer = revealTimers.get(el)

          if (entry.isIntersecting) {
            if (activeTimer !== undefined || el.classList.contains('is-revealed')) continue
            const delay = reduceMotion ? 0 : Number(el.dataset.revealDelay || 0)
            const timer = window.setTimeout(() => {
              el.classList.add('is-revealed')
              revealTimers.delete(el)
            }, delay)
            revealTimers.set(el, timer)
            continue
          }

          // An element moving below the viewport means the user reversed the
          // scroll direction. Reset it so the CSS transition plays backward
          // now and can replay on the next downward entry.
          if (entry.boundingClientRect.top >= window.innerHeight * 0.9) {
            resetReveal(el)
          } else if (activeTimer !== undefined) {
            window.clearTimeout(activeTimer)
            revealTimers.delete(el)
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add('is-revealed'))
    } else {
      nodes.forEach((node) => observer.observe(node))
    }

    let raf = 0
    const onScroll = () => {
      if (reduceMotion) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight || 1
        for (const node of nodes) {
          if (node.getBoundingClientRect().top >= vh * 0.92) {
            resetReveal(node)
          }
        }

        for (const node of parallaxNodes) {
          const rect = node.getBoundingClientRect()
          if (rect.bottom < 0 || rect.top > vh) continue
          const progress = (vh - rect.top) / (vh + rect.height)
          const isMedia = node.matches('.media-card__img, .hero__bg-slide img')
          const strength = Number(node.dataset.parallaxStrength || (isMedia ? 28 : 12))
          const offset = (progress - 0.5) * strength
          node.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      revealTimers.forEach((timer) => window.clearTimeout(timer))
      revealTimers.clear()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}
