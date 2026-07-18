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
import type { ColumnMediaTab, ColumnMediaTabDef } from '../../data/columnMedia'
import { tabListPath } from '../../data/columnMedia'
import { LOCAL_TABS_ANCHOR_ID } from '../../hooks/useScrollToLocalTabs'
import './LocalTabs.css'

type LocalTabsProps = {
  tabs: ColumnMediaTabDef[]
  /** Currently selected tab (from route) */
  activeTab: ColumnMediaTab
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
 * Local menu under a sub-page (컬럼 / 간행물 / 미디어).
 * - Hover: teal underline follows the hovered tab
 * - Click: selected state + route to that tab’s list
 * - Sticky under fixed GNB while the page scrolls
 */
export function LocalTabs({ tabs, activeTab }: LocalTabsProps) {
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

  // Detect sticky pin: sentinel leaves the band below the GNB
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
        aria-label="컬럼미디어 로컬 메뉴"
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
                to={tabListPath(tab.id)}
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
