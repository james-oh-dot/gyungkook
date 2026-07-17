import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const parallaxNodes = Array.from(
      document.querySelectorAll<HTMLElement>('.media-card__img, .hero__bg-slide img'),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay || 0)
          window.setTimeout(() => {
            el.classList.add('is-revealed')
          }, delay)
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    nodes.forEach((node) => observer.observe(node))

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight || 1
        for (const img of parallaxNodes) {
          const rect = img.getBoundingClientRect()
          if (rect.bottom < 0 || rect.top > vh) continue
          const progress = (vh - rect.top) / (vh + rect.height)
          const offset = (progress - 0.5) * 28
          img.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}
