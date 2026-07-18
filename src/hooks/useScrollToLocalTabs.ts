import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Anchor id on the column-media local tab bar. */
export const LOCAL_TABS_ANCHOR_ID = 'column-media-local-tabs'

/** Location state set by LocalTabs NavLinks — keep sticky tab position on tab change. */
export type ColumnMediaLocationState = {
  scrollToLocalTabs?: boolean
}

/**
 * True for detail routes: `/press/column-media/:tab/:postId`
 * False for list / tab routes: `/press/column-media/:tab`
 */
export function isColumnMediaDetailPath(pathname: string): boolean {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  const idx = parts.indexOf('column-media')
  if (idx < 0) return false
  // [..., 'column-media', tab, postId]
  return parts.length >= idx + 3
}

export function shouldScrollToLocalTabs(
  pathname: string,
  state: unknown,
): boolean {
  if (isColumnMediaDetailPath(pathname)) return true
  return Boolean((state as ColumnMediaLocationState | null)?.scrollToLocalTabs)
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

    // Double rAF: wait for Outlet content paint so scroll height is final
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
