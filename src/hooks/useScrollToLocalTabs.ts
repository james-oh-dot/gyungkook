import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Anchor id on the column-media local tab bar. */
export const LOCAL_TABS_ANCHOR_ID = 'column-media-local-tabs'

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

/**
 * Scroll to the local tab bar only when entering / switching post detail
 * (list→detail, detail prev/next). Menu entry and tab switches keep the
 * sub-visual in view (handled by ScrollToTop → y=0).
 */
export function useScrollToLocalTabs() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (!isColumnMediaDetailPath(pathname)) return

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
  }, [pathname])
}
