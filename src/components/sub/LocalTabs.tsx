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

type LocalTabsProps = {
  tabs: LocalTabItem[]
  activeTab: string
  /** Build list path for a tab id */
  toTab: (tabId: string) => string
  ariaLabel?: string
}

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
 * - Click: selected + route (sticky scroll via `state.scrollToLocalTabs`)
 * - Sticky under fixed GNB while the page scrolls
 */
export function LocalTabs({
  tabs,
  activeTab,
  toTab,
  ariaLabel = '로컬 메뉴',
}: LocalTabsProps) {
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [indicator, setIndicator] = useState<Indicator | null>(null)
  const [ready, setReady] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [stuck, setStuck] = useState(false)

  const selectedIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab),
  )
  const focusIndex = hoverIndex ?? selectedIndex

  const measure = useCallback((index: number) => {
    const nav = navRef.current
    const item = itemRefs.current[index]
    if (!nav || !item) return
    const navBox = nav.getBoundingClientRect()
    const link = item.querySelector('a')
    const target = (link ?? item).getBoundingClientRect()
    setIndicator({
      x: target.left - navBox.left,
      w: target.width,
    })
  }, [])

  useLayoutEffect(() => {
    measure(focusIndex)
    setReady(true)
  }, [focusIndex, measure, location.pathname])

  useEffect(() => {
    const onResize = () => measure(focusIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [focusIndex, measure])

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
        opacity: ready ? 1 : 0,
      }
    : undefined

  return (
    <>
      <div ref={sentinelRef} className="local-tabs__sentinel" aria-hidden="true" />
      <nav
        ref={navRef}
        id={LOCAL_TABS_ANCHOR_ID}
        className={`local-tabs${stuck ? ' is-stuck' : ''}`}
        data-name="Section / Bread"
        aria-label={ariaLabel}
        onMouseLeave={onLeave}
      >
        <ul className="local-tabs__list" role="list">
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
              {index > 0 ? <span className="local-tabs__sep" aria-hidden="true" /> : null}
              <NavLink
                to={toTab(tab.id)}
                state={{ scrollToLocalTabs: true }}
                className={() =>
                  `local-tabs__link${tab.id === activeTab ? ' is-selected' : ''}`
                }
                end
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <span
          className={`local-tabs__indicator${ready ? ' is-ready' : ''}`}
          style={style}
          aria-hidden="true"
        />
      </nav>
    </>
  )
}
