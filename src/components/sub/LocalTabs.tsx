import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LOCAL_TABS_ANCHOR_ID } from '../../hooks/useScrollToLocalTabs'
import './LocalTabs.css'

export type LocalTabItem = {
  id: string
  label: string
}

type LocalTabsBase = {
  tabs: LocalTabItem[]
  activeTab: string
  ariaLabel?: string
}

/** Route mode — used by column-media / press coverage shells */
type LocalTabsRouteProps = LocalTabsBase & {
  toTab: (tabId: string) => string
  onTabSelect?: never
  /**
   * Location state attached to each tab NavLink. Defaults to
   * `{ scrollToLocalTabs: true }` (board tabs stick under GNB). Pass `null`
   * for page-switch tabs that should reveal the new hero at the top
   * (e.g. 변호사 · 자문단 — each tab is a different lawyer page).
   */
  routeState?: Record<string, unknown> | null
}

/** Scroll mode — in-page section tabs (e.g. 정비사업) */
type LocalTabsScrollProps = LocalTabsBase & {
  toTab?: never
  onTabSelect: (tabId: string) => void
}

export type LocalTabsProps = LocalTabsRouteProps | LocalTabsScrollProps

type Indicator = { x: number; w: number }

function readGnbBarH(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gnb-bar-h')
    .trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 100
}

/**
 * Local menu under a sub-page visual.
 * - Hover: teal underline follows the hovered tab
 * - Scroll-mode (in-page sections): bar slides from the current tab to the next
 * - Route-mode (page switch): bar springs from the first tab to the active tab
 * - Sticky under fixed GNB while the page scrolls
 * - Tablet/mobile: horizontal scroll when tabs overflow
 */
export function LocalTabs(props: LocalTabsProps) {
  const { tabs, activeTab, ariaLabel = '로컬 메뉴' } = props
  const toTab = 'toTab' in props ? props.toTab : undefined
  const onTabSelect = 'onTabSelect' in props ? props.onTabSelect : undefined
  const isScrollMode = Boolean(onTabSelect)
  const routeState =
    'routeState' in props && props.routeState !== undefined
      ? props.routeState
      : { scrollToLocalTabs: true }

  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [indicator, setIndicator] = useState<Indicator | null>(null)
  const [ready, setReady] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [stuck, setStuck] = useState(false)
  const prevActiveKey = useRef<string | null>(null)
  const routeKey = `${location.pathname}${location.hash}`

  const selectedIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab),
  )
  const focusIndex = hoverIndex ?? selectedIndex
  const activeKey = `${activeTab}::${routeKey}`

  const readMetric = useCallback((index: number): Indicator | null => {
    const list = listRef.current
    const item = itemRefs.current[index]
    if (!list || !item) return null
    const listBox = list.getBoundingClientRect()
    const link = item.querySelector('a, button.local-tabs__link')
    const target = (link ?? item).getBoundingClientRect()
    return {
      x: target.left - listBox.left,
      w: target.width,
    }
  }, [])

  const measure = useCallback(
    (index: number) => {
      const next = readMetric(index)
      if (next) setIndicator(next)
    },
    [readMetric],
  )

  /*
   * Route mode: on page change, snap to the first tab then spring to the
   * selection. Scroll mode (in-page sections): slide from the current tab
   * straight to the destination — never rewind to the front.
   */
  useLayoutEffect(() => {
    if (hoverIndex !== null) {
      measure(hoverIndex)
      setReady(true)
      setJumping(false)
      return
    }

    const changed = prevActiveKey.current !== null && prevActiveKey.current !== activeKey
    prevActiveKey.current = activeKey

    if (!isScrollMode && changed && selectedIndex > 0) {
      const from = readMetric(0)
      const to = readMetric(selectedIndex)
      if (from && to) {
        setJumping(true)
        setReady(false)
        setIndicator(from)
        let raf2 = 0
        const raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            setJumping(false)
            setReady(true)
            setIndicator(to)
          })
        })
        return () => {
          cancelAnimationFrame(raf1)
          cancelAnimationFrame(raf2)
        }
      }
    }

    measure(selectedIndex)
    setJumping(false)
    setReady(true)
  }, [activeKey, hoverIndex, isScrollMode, measure, readMetric, selectedIndex])

  useEffect(() => {
    const onResize = () => measure(focusIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [focusIndex, measure])

  /* Keep active tab visible when the bar overflows (tablet / mobile). */
  useEffect(() => {
    const item = itemRefs.current[selectedIndex]
    const viewport = viewportRef.current
    if (!item || !viewport) return
    if (viewport.scrollWidth <= viewport.clientWidth + 1) return

    const itemBox = item.getBoundingClientRect()
    const viewBox = viewport.getBoundingClientRect()
    const pad = 24
    if (itemBox.left < viewBox.left + pad) {
      viewport.scrollBy({
        left: itemBox.left - viewBox.left - pad,
        behavior: 'smooth',
      })
    } else if (itemBox.right > viewBox.right - pad) {
      viewport.scrollBy({
        left: itemBox.right - viewBox.right + pad,
        behavior: 'smooth',
      })
    }
  }, [selectedIndex, activeTab])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observe = () => {
      const gnbH = readGnbBarH()
      const io = new IntersectionObserver(
        ([entry]) => {
          setStuck(!entry.isIntersecting)
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${gnbH + 1}px 0px 0px 0px`,
        },
      )
      io.observe(sentinel)
      return io
    }

    let io = observe()
    const onResize = () => {
      io.disconnect()
      io = observe()
    }
    window.addEventListener('resize', onResize)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const onLeave = (e: MouseEvent<HTMLElement>) => {
    const next = e.relatedTarget
    if (next instanceof Node && e.currentTarget.contains(next)) return
    setHoverIndex(null)
  }

  const style: CSSProperties | undefined = indicator
    ? {
        transform: `translate3d(${indicator.x}px, 0, 0)`,
        width: indicator.w,
        opacity: ready || jumping ? 1 : 0,
      }
    : undefined

  return (
    <>
      <div ref={sentinelRef} className="local-tabs__sentinel" aria-hidden="true" />
      <nav
        ref={navRef}
        id={LOCAL_TABS_ANCHOR_ID}
        className={`local-tabs${stuck ? ' is-stuck' : ''}${onTabSelect ? ' local-tabs--scroll' : ''}`}
        data-name="Section / Bread"
        aria-label={ariaLabel}
        onMouseLeave={onLeave}
      >
        <div ref={viewportRef} className="local-tabs__viewport">
          <ul ref={listRef} className="local-tabs__list" role="list">
            {tabs.map((tab, index) => (
              <li
                key={tab.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                className="local-tabs__item"
                onMouseEnter={() => setHoverIndex(index)}
                onFocus={() => setHoverIndex(index)}
              >
                {index > 0 ? (
                  <span className="local-tabs__sep" aria-hidden="true" />
                ) : null}
                {toTab ? (
                  <NavLink
                    to={toTab(tab.id)}
                    state={routeState ?? undefined}
                    className={() =>
                      `local-tabs__link${tab.id === activeTab ? ' is-selected' : ''}`
                    }
                    end
                  >
                    {tab.label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className={`local-tabs__link${tab.id === activeTab ? ' is-selected' : ''}`}
                    aria-current={tab.id === activeTab ? 'true' : undefined}
                    onClick={() => onTabSelect?.(tab.id)}
                  >
                    {tab.label}
                  </button>
                )}
              </li>
            ))}
            <span
              className={`local-tabs__indicator${ready ? ' is-ready' : ''}${jumping ? ' is-jumping' : ''}`}
              style={style}
              aria-hidden="true"
            />
          </ul>
        </div>
      </nav>
    </>
  )
}
