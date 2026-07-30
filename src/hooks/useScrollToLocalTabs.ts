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
 * `/press/social/:postId` (no tab segment)
 */
export function isBoardDetailPath(pathname: string): boolean {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  if (parts[0] !== 'press') return false
  // ['press', 'social', postId]
  if (parts[1] === 'social') return parts.length >= 3
  // ['press', section, tab, postId]
  if (!BOARD_SECTIONS.has(parts[1] ?? '')) return false
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

/** Current GNB bar height from the CSS token (falls back to 100). */
function readGnbBarH(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gnb-bar-h')
    .trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 100
}

/**
 * Non-sticky reference marking where the local tabs (or board content) start.
 *
 * ⚠️ HARD-WON: the tabs `<nav id={LOCAL_TABS_ANCHOR_ID}>` is
 * `position: sticky; top: var(--gnb-bar-h)`. Calling `scrollIntoView()` on it
 * is a **no-op once it is stuck** — the browser sees its rect already at the
 * viewport start, so list→detail / prev·next never moved (2026-07 bug).
 * We must measure a **non-sticky** node instead:
 * - tabbed boards → `.local-tabs__sentinel` (1px marker right before the nav)
 * - 사회공헌 (no tabs) → the `#subpage-local-tabs` anchor div (non-sticky)
 */
function findScrollAnchor(): HTMLElement | null {
  const sentinel =
    document.querySelector<HTMLElement>('.local-tabs__sentinel')
  if (sentinel) return sentinel
  return document.getElementById(LOCAL_TABS_ANCHOR_ID)
}

/**
 * Scroll so the local tab bar sticks right under the GNB (board content top
 * visible) when:
 * - list → detail / detail prev·next
 * - local tab click (`state.scrollToLocalTabs`)
 *
 * GNB/menu entry has no state → ScrollToTop keeps the sub-visual in view.
 *
 * Uses `window.scrollTo(natural top − GNB)` from a non-sticky anchor rather
 * than `scrollIntoView` on the sticky nav (see `findScrollAnchor`).
 */
export function useScrollToLocalTabs() {
  const { pathname, state } = useLocation()

  useLayoutEffect(() => {
    if (!shouldScrollToLocalTabs(pathname, state)) return

    // Double rAF: let the new route's content lay out before measuring.
    let raf2 = 0
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const anchor = findScrollAnchor()
        if (!anchor) return
        const targetY =
          window.scrollY + anchor.getBoundingClientRect().top - readGnbBarH()
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
      })
    })

    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [pathname, state])
}
