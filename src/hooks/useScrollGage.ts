import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type ScrollGageOptions = {
  /** Max thumb height when active (px). */
  activeHeight?: number
}

/**
 * Syncs a custom gage scrollbar with a horizontal scroll container.
 * Thickens on hover / while scrolling; thumb is draggable.
 */
export function useScrollGage(options: ScrollGageOptions = {}) {
  const activeHeight = options.activeHeight ?? 20
  const trackRef = useRef<HTMLDivElement>(null)
  const gageRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(0.2)
  const [offset, setOffset] = useState(0)
  const [active, setActive] = useState(false)
  const draggingRef = useRef(false)
  const fadeTimerRef = useRef(0)

  const syncFromTrack = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) {
      setRatio(1)
      setOffset(0)
      return
    }
    setRatio(el.clientWidth / el.scrollWidth)
    setOffset(el.scrollLeft / max)
  }, [])

  const pulseActive = useCallback(() => {
    setActive(true)
    window.clearTimeout(fadeTimerRef.current)
    fadeTimerRef.current = window.setTimeout(() => {
      if (!draggingRef.current && !gageRef.current?.matches(':hover')) {
        setActive(false)
      }
    }, 900)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    syncFromTrack()
    const onScroll = () => {
      syncFromTrack()
      pulseActive()
    }
    const onResize = () => syncFromTrack()

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(fadeTimerRef.current)
    }
  }, [pulseActive, syncFromTrack])

  const scrollToOffset = useCallback((nextOffset: number) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) return
    const clamped = Math.min(1, Math.max(0, nextOffset))
    el.scrollLeft = clamped * max
    setOffset(clamped)
  }, [])

  const onGagePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const gage = gageRef.current
      const el = trackRef.current
      if (!gage || !el) return

      draggingRef.current = true
      setActive(true)
      gage.setPointerCapture(event.pointerId)

      const rect = gage.getBoundingClientRect()
      const thumbRatio = Math.min(1, Math.max(0.08, ratio))
      const usable = 1 - thumbRatio

      const updateFromClientX = (clientX: number) => {
        if (usable <= 0) return
        const x = (clientX - rect.left) / rect.width
        const next = (x - thumbRatio / 2) / usable
        scrollToOffset(next)
      }

      updateFromClientX(event.clientX)

      const onMove = (e: PointerEvent) => updateFromClientX(e.clientX)
      const onUp = () => {
        draggingRef.current = false
        gage.releasePointerCapture(event.pointerId)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        pulseActive()
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [pulseActive, ratio, scrollToOffset],
  )

  return {
    trackRef,
    gageRef,
    ratio,
    offset,
    active,
    activeHeight,
    setGageHover: setActive,
    onGagePointerDown,
  }
}
