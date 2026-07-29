import { useCallback, useEffect, useState, type RefObject } from 'react'

/**
 * Drives a horizontally-scrolling, scroll-snapped card track from a pair of
 * prev/next buttons (mobile carousels — HomeSections NoticeSection/PressSection).
 * `trackRef` must point at the scrollable element itself (`overflow-x: auto`).
 */
export function useCardTrackNav(trackRef: RefObject<HTMLElement | null>) {
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 2)
    setCanNext(el.scrollLeft < max - 2)
  }, [trackRef])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, trackRef])

  /* One card = the track's own width at every breakpoint this is used on
     (mobile-only carousels, single card per view) — no per-card measurement needed. */
  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current
      if (!el) return
      el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
    },
    [trackRef],
  )

  return {
    canPrev,
    canNext,
    prev: () => scrollByCard(-1),
    next: () => scrollByCard(1),
  }
}
