import { useCallback, useEffect, useState, type RefObject } from 'react'

/**
 * Prev/next for a horizontally scrolling card rail (Notice / Press galleries).
 * Steps by measured card width + gap (Apple feature-card-gallery style).
 * Falls back to the track's clientWidth when no card is measurable (e.g. mobile
 * single-column snap where the item fills the viewport).
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
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      ro?.disconnect()
    }
  }, [sync, trackRef])

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current
      if (!el) return

      const item =
        el.querySelector<HTMLElement>('[data-gallery-card]') ??
        (el.firstElementChild as HTMLElement | null)

      let step = el.clientWidth
      if (item) {
        const styles = getComputedStyle(el)
        const gap =
          parseFloat(styles.columnGap || styles.gap || '0') ||
          parseFloat(styles.rowGap || '0') ||
          0
        step = item.getBoundingClientRect().width + gap
      }

      const max = Math.max(0, el.scrollWidth - el.clientWidth)
      const next = Math.min(max, Math.max(0, el.scrollLeft + dir * step))
      el.scrollTo({ left: next, behavior: 'smooth' })
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
