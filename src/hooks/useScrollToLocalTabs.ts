import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Anchor id on the column-media local tab bar. */
export const LOCAL_TABS_ANCHOR_ID = 'column-media-local-tabs'

/**
 * On every in-section route change (tab / detail / prev·next),
 * scroll so the local tab bar sits just below the fixed GNB.
 */
export function useScrollToLocalTabs() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
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
