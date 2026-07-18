import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Anchor id shared by subpage local tab bars (only one mounts at a time). */
export const LOCAL_TABS_ANCHOR_ID = 'subpage-local-tabs'

/** Location state set by LocalTabs NavLinks — keep sticky tab position on tab change. */
export type LocalTabsLocationState = {
  scrollToLocalTabs?: boolean
}

const BOARD_SECTIONS = new Set(['column-media', 'coverage'])

/**
 * True for board detail routes:
 * `/press/column-media/:tab/:postId` | `/press/coverage/:tab/:postId`
 */
export function isBoardDetailPath(pathname: string): boolean {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  // ['press', section, tab, postId]
  if (parts[0] !== 'press' || !BOARD_SECTIONS.has(parts[1] ?? '')) return false
  return parts.length >= 4
}

/** @deprecated use isBoardDetailPath */
export const isColumnMediaDetailPath = isBoardDetailPath

export function shouldScrollToLocalTabs(
  pathname: string,
  state: unknown,
): boolean {
  if (isBoardDetailPath(pathname)) return true
  return Boolean((state as LocalTabsLocationState | null)?.scrollToLocalTabs)
}

/**
 * Scroll to the local tab bar (sticky under GNB) when:
 * - list → detail / detail prev·next
 * - local tab click (`state.scrollToLocalTabs`)
 *
 * GNB/menu entry has no state → ScrollToTop keeps the sub-visual in view.
 */
export function useScrollToLocalTabs() {
  const { pathname, state } = useLocation()

  useLayoutEffect(() => {
    if (!shouldScrollToLocalTabs(pathname, state)) return

    const el = document.getElementById(LOCAL_TABS_ANCHOR_ID)
    if (!el) return

    let raf2 = 0
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [pathname, state])
}
