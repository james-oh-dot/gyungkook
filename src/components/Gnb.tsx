import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { GNB_SUB_VISUAL_PLACEHOLDER, NAV_ITEMS } from '../data/nav'
import { asset } from '../utils/asset'
import { resolveNavHref } from '../utils/path'
import { SearchOverlay } from './SearchOverlay'
import './Gnb.css'

type Indicator = { x: number; y: number; w: number; h: number }

/** Desktop fullmenu: column offsets from fullmenu-inner padding edge. */
type ColumnLayout = {
  lefts: number[]
  widths: number[]
}

const MQ_COMPACT = '(max-width: 1024px)'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function Gnb() {
  const isCompact = useMediaQuery(MQ_COMPACT)
  const rootRef = useRef<HTMLElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const fullmenuInnerRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const reactId = useId()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTop, setActiveTop] = useState<number | null>(null)
  const [activeSubId, setActiveSubId] = useState<string | null>(null)
  const [visualSrc, setVisualSrc] = useState(GNB_SUB_VISUAL_PLACEHOLDER)
  const [visualKey, setVisualKey] = useState(0)
  const [indicator, setIndicator] = useState<Indicator | null>(null)
  const [indicatorReady, setIndicatorReady] = useState(false)
  const [columnLayout, setColumnLayout] = useState<ColumnLayout | null>(null)
  const [drawerExpanded, setDrawerExpanded] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const solid = scrolled || menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close desktop mega when switching to compact (or vice versa). */
  useEffect(() => {
    setMenuOpen(false)
    setActiveTop(null)
    setActiveSubId(null)
    setIndicator(null)
    setIndicatorReady(false)
    setDrawerExpanded(null)
  }, [isCompact])

  /* Body scroll lock + Escape while drawer open */
  useEffect(() => {
    if (!isCompact || !menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      setDrawerExpanded(null)
      menuBtnRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    closeBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isCompact, menuOpen])

  const measureIndicator = useCallback((index: number) => {
    const list = navListRef.current
    const el = itemRefs.current[index]
    if (!list || !el) return
    const lr = list.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setIndicator({
      x: er.left - lr.left,
      y: er.top - lr.top,
      w: er.width,
      h: er.height,
    })
    requestAnimationFrame(() => setIndicatorReady(true))
  }, [])

  useLayoutEffect(() => {
    if (activeTop == null || isCompact) return
    measureIndicator(activeTop)
  }, [activeTop, isCompact, measureIndicator, menuOpen])

  useEffect(() => {
    if (activeTop == null || isCompact) return
    const onResize = () => measureIndicator(activeTop)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeTop, isCompact, measureIndicator])

  /* Align fullmenu columns to each top-nav item's left edge.
   * Absolute children are positioned from the padding edge of
   * `.gnb__fullmenu-inner`, so offsets are measured from that origin.
   * Sub-visual is a full-bleed framed background (see Gnb.css) — not sized here. */
  const syncColumnLayout = useCallback(() => {
    const inner = fullmenuInnerRef.current
    if (!inner || isCompact || !menuOpen) return

    const innerRect = inner.getBoundingClientRect()
    const styles = getComputedStyle(inner)
    const padRight = parseFloat(styles.paddingRight) || 0
    /* Padding-edge origin matches CSS absolute `left: 0`. */
    const originLeft = innerRect.left
    const contentRight = Math.max(0, inner.clientWidth - padRight)

    const lefts = NAV_ITEMS.map((_, index) => {
      const el = itemRefs.current[index]
      if (!el) return 0
      return Math.max(0, Math.round(el.getBoundingClientRect().left - originLeft))
    })

    if (!lefts.length || lefts.every((v) => v === 0)) return

    const widths = lefts.map((left, index) => {
      if (index < lefts.length - 1) return Math.max(0, lefts[index + 1] - left)
      return Math.max(0, contentRight - left)
    })

    setColumnLayout({ lefts, widths })
  }, [isCompact, menuOpen])

  useLayoutEffect(() => {
    if (!menuOpen || isCompact) {
      setColumnLayout(null)
      return
    }

    syncColumnLayout()
    const raf = requestAnimationFrame(syncColumnLayout)
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) syncColumnLayout()
    })
    window.addEventListener('resize', syncColumnLayout)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncColumnLayout)
    }
  }, [menuOpen, isCompact, syncColumnLayout])

  const openDesktopMenu = (index: number) => {
    if (isCompact) return
    setMenuOpen(true)
    if (activeTop !== index) {
      const first = NAV_ITEMS[index]?.children[0]
      if (first) {
        setActiveSubId(first.id)
        setVisualSrc(first.visual)
        /* Same placeholder for now — key bump still plays swap motion. */
        setVisualKey((k) => k + 1)
      }
    }
    setActiveTop(index)
  }

  const closeDesktopMenu = () => {
    if (isCompact) return
    setMenuOpen(false)
    setActiveTop(null)
    setActiveSubId(null)
    setIndicatorReady(false)
    setIndicator(null)
  }

  const onRootLeave = (e: MouseEvent<HTMLElement>) => {
    if (isCompact) return
    const next = e.relatedTarget
    if (next instanceof Node && rootRef.current?.contains(next)) return
    closeDesktopMenu()
  }

  const onRootBlur = (e: FocusEvent<HTMLElement>) => {
    if (isCompact) return
    const next = e.relatedTarget
    if (next instanceof Node && rootRef.current?.contains(next)) return
    closeDesktopMenu()
  }

  const swapVisual = (src: string, subId: string) => {
    setActiveSubId(subId)
    setVisualSrc(src)
    setVisualKey((k) => k + 1)
  }

  const openDrawer = () => {
    setMenuOpen(true)
    setDrawerExpanded(NAV_ITEMS[0]?.id ?? null)
  }

  const closeDrawer = () => {
    setMenuOpen(false)
    setDrawerExpanded(null)
    menuBtnRef.current?.focus()
  }

  const onDrawerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !drawerRef.current) return
    const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const indicatorStyle: CSSProperties | undefined = indicator
    ? {
        transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
        width: indicator.w,
        height: indicator.h,
        opacity: indicatorReady ? 1 : 0,
      }
    : undefined

  return (
    <header
      ref={rootRef}
      className={[
        'gnb',
        solid ? 'gnb--solid' : 'gnb--over-hero',
        menuOpen ? 'gnb--open' : '',
        isCompact ? 'gnb--compact' : 'gnb--desktop',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseLeave={onRootLeave}
      onBlur={onRootBlur}
    >
      <div className="gnb__bar">
        {isCompact ? (
          <button
            ref={menuBtnRef}
            type="button"
            className="gnb__glass gnb__menu-btn"
            aria-expanded={menuOpen}
            aria-controls={`${reactId}-drawer`}
            onClick={() => (menuOpen ? closeDrawer() : openDrawer())}
          >
            <img
              src={asset(menuOpen ? 'assets/icon-close.svg' : 'assets/icon-menu.svg')}
              alt=""
              className="gnb__icon"
            />
            <span className="gnb__menu-label">메뉴</span>
          </button>
        ) : (
          <a className="gnb__logo" href={resolveNavHref("/")} aria-label="법무법인 경국 홈">
            <img className="gnb__logo-mark" src={asset('assets/logo-mark.png')} alt="" />
            <img
              className="gnb__logo-word"
              src={asset(
                solid ? 'assets/logo-wordmark-dark.svg' : 'assets/logo-wordmark-light.svg',
              )}
              alt="법무법인 경국 LAW FIRM GYUNGKOOK"
            />
          </a>
        )}

        {!isCompact && (
          <nav className="gnb__nav" aria-label="주요 메뉴">
            <ul ref={navListRef} className="gnb__nav-list" role="list">
              <li
                className={`gnb__indicator${indicatorReady ? ' is-ready' : ''}`}
                style={indicatorStyle}
                aria-hidden="true"
              />
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  className={`gnb__nav-item${activeTop === index ? ' is-active' : ''}`}
                  onMouseEnter={() => openDesktopMenu(index)}
                  onFocus={() => openDesktopMenu(index)}
                >
                  <a
                    className="gnb__nav-link"
                    href={resolveNavHref(item.href)}
                    onClick={() => closeDesktopMenu()}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="gnb__actions">
          <a className="gnb__glass gnb__action" href={resolveNavHref("#office")}>
            <img src={asset('assets/icon-call.svg')} alt="" className="gnb__icon" />
            <span className="gnb__action-label">상담하기</span>
          </a>
          <button
            type="button"
            className="gnb__glass gnb__action"
            aria-label="검색하기"
            aria-expanded={searchOpen}
            onClick={() => {
              closeDesktopMenu()
              setMenuOpen(false)
              setDrawerExpanded(null)
              setSearchOpen(true)
            }}
          >
            <img src={asset('assets/icon-search.svg')} alt="" className="gnb__icon" />
            <span className="gnb__action-label">검색하기</span>
          </button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Fullmenu */}
      {!isCompact && (
        <div
          className={`gnb__fullmenu${menuOpen ? ' is-open' : ''}`}
          id={`${reactId}-fullmenu`}
          hidden={!menuOpen}
          onMouseLeave={(e) => {
            const next = e.relatedTarget
            if (next instanceof Node && rootRef.current?.contains(next)) return
            closeDesktopMenu()
          }}
        >
          <div
            ref={fullmenuInnerRef}
            className={`gnb__fullmenu-inner${columnLayout ? ' is-nav-aligned' : ''}`}
          >
            {/* Full-bleed sub-visual inside the 24px frame (see Gnb.css). */}
            <div className="gnb__visual" aria-hidden="true">
              <img
                key={visualKey}
                className="gnb__visual-img"
                src={visualSrc}
                alt=""
              />
            </div>
            <div
              className="gnb__columns"
              role="navigation"
              aria-label="전체 메뉴"
              style={
                columnLayout
                  ? { left: columnLayout.lefts[0] ?? 0 }
                  : undefined
              }
            >
              {NAV_ITEMS.map((item, index) => {
                const alignedStyle: CSSProperties | undefined = columnLayout
                  ? {
                      left: (columnLayout.lefts[index] ?? 0) - (columnLayout.lefts[0] ?? 0),
                      width: columnLayout.widths[index],
                    }
                  : undefined
                return (
                  <div
                    key={item.id}
                    className={`gnb__column${activeTop === index ? ' is-active' : ''}`}
                    style={alignedStyle}
                    onMouseEnter={() => openDesktopMenu(index)}
                  >
                    <ul className="gnb__sublist" role="list">
                      {item.children.map((sub) => (
                        <li key={sub.id}>
                          <a
                            className={`gnb__sublink${activeSubId === sub.id ? ' is-active' : ''}`}
                            href={resolveNavHref(sub.href)}
                            onMouseEnter={() => swapVisual(sub.visual, sub.id)}
                            onFocus={() => {
                              openDesktopMenu(index)
                              swapVisual(sub.visual, sub.id)
                            }}
                            onClick={() => closeDesktopMenu()}
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Compact left drawer */}
      {isCompact && (
        <>
          <button
            type="button"
            className={`gnb__scrim${menuOpen ? ' is-open' : ''}`}
            aria-label="메뉴 닫기"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeDrawer}
          />
          <div
            ref={drawerRef}
            id={`${reactId}-drawer`}
            className={`gnb__drawer${menuOpen ? ' is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
            aria-hidden={!menuOpen}
            onKeyDown={onDrawerKeyDown}
          >
            <div className="gnb__drawer-head">
              <a className="gnb__logo gnb__logo--drawer" href={resolveNavHref("/")} onClick={closeDrawer}>
                <img className="gnb__logo-mark" src={asset('assets/logo-mark.png')} alt="" />
                <img
                  className="gnb__logo-word"
                  src={asset('assets/logo-wordmark-dark.svg')}
                  alt="법무법인 경국"
                />
              </a>
              <button
                ref={closeBtnRef}
                type="button"
                className="gnb__drawer-close"
                aria-label="메뉴 닫기"
                onClick={closeDrawer}
              >
                <img src={asset('assets/icon-close.svg')} alt="" className="gnb__icon" />
              </button>
            </div>

            <nav className="gnb__drawer-nav" aria-label="모바일 메뉴">
              <ul className="gnb__drawer-list" role="list">
                {NAV_ITEMS.map((item) => {
                  const expanded = drawerExpanded === item.id
                  const panelId = `${reactId}-panel-${item.id}`
                  return (
                    <li key={item.id} className="gnb__drawer-item">
                      <button
                        type="button"
                        className={`gnb__drawer-top${expanded ? ' is-expanded' : ''}`}
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        onClick={() =>
                          setDrawerExpanded((cur) => (cur === item.id ? null : item.id))
                        }
                      >
                        <span>{item.label}</span>
                        <span className="gnb__drawer-chevron" aria-hidden="true" />
                      </button>
                      <div
                        id={panelId}
                        className={`gnb__drawer-panel${expanded ? ' is-open' : ''}`}
                        hidden={!expanded}
                      >
                        <ul role="list">
                          {item.children.map((sub) => (
                            <li key={sub.id}>
                              <a
                                className="gnb__drawer-sublink"
                                href={resolveNavHref(sub.href)}
                                onClick={closeDrawer}
                              >
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="gnb__drawer-foot">
              <a className="gnb__drawer-cta" href={resolveNavHref("#office")} onClick={closeDrawer}>
                <img src={asset('assets/icon-call.svg')} alt="" className="gnb__icon" />
                상담 신청
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
