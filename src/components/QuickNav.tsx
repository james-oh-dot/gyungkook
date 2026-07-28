import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { asset } from '../utils/asset'
import { resolveNavHref } from '../utils/path'
import './QuickNav.css'

/**
 * quick-left-floating-Navigation (Figma `AI-quick` 120:974 / 120:1025).
 *
 * Tablet + mobile only (≤1024), pinned bottom-left (20/20). Never shown on
 * first paint — it slides in from off-screen once the user scrolls **down**
 * (compact), and expands to the full labelled rail while scrolling **up**.
 * Scrolling down again collapses it back to compact; returning to the top
 * sends it back off-screen.
 *
 * Icons are the uploaded `public/assets/{버튼명}.svg` files, painted via
 * `mask-image` + `background: currentColor` rather than `<img>`: each item
 * cycles four colours (default / hover / pressed / highlighted) and the SVGs
 * ship with their own hard-coded fills, which `<img>` could not recolour.
 */

type Mode = 'hidden' | 'compact' | 'expanded'

/** Ignore sub-pixel/rubber-band jitter before flipping direction. */
const DIR_THRESHOLD = 6
/** Below this the rail is considered "at the top" and hides again. */
const SHOW_AFTER = 120

const KAKAO_PC = 'http://pf.kakao.com/_twVnn'
const KAKAO_MOBILE = 'http://pf.kakao.com/_twVnn/chat'

/** Korean filenames must be percent-encoded before they reach CSS `url()`. */
function iconVar(name: string): CSSProperties {
  return {
    '--quicknav-icon': `url("${asset(`assets/${encodeURIComponent(name)}.svg`)}")`,
  } as CSSProperties
}

export function QuickNav() {
  const [mode, setMode] = useState<Mode>('hidden')
  const lastYRef = useRef(0)

  useEffect(() => {
    lastYRef.current = window.scrollY

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        const delta = y - lastYRef.current
        if (Math.abs(delta) < DIR_THRESHOLD) return
        lastYRef.current = y

        if (y <= SHOW_AFTER) {
          setMode('hidden')
          return
        }
        /* Forward scroll → compact, reverse scroll → expanded */
        setMode(delta > 0 ? 'compact' : 'expanded')
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const expand = useCallback(() => setMode('expanded'), [])

  const kakaoHref =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? KAKAO_MOBILE
      : KAKAO_PC

  return (
    <nav
      className={`quicknav quicknav--${mode}`}
      aria-label="빠른 메뉴"
      /* Off-screen state must not be reachable by keyboard or AT */
      aria-hidden={mode === 'hidden'}
      inert={mode === 'hidden'}
    >
      <div className="quicknav__panel">
        <div className="quicknav__full">
          <a className="quicknav__item" href={resolveNavHref('/about/location')}>
            <span className="quicknav__icon" style={iconVar('오시는길')} aria-hidden="true" />
            <span className="quicknav__label">오시는길</span>
          </a>

          <a
            className="quicknav__item"
            href={kakaoHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="quicknav__icon" style={iconVar('카톡문의')} aria-hidden="true" />
            <span className="quicknav__label">카톡문의</span>
          </a>

          <a className="quicknav__item" href={resolveNavHref('/news/consult')}>
            <span className="quicknav__icon" style={iconVar('진행사건문의')} aria-hidden="true" />
            <span className="quicknav__label">진행사건문의</span>
          </a>

          {/* Figma `무료법률상담만하이라이트상태` — white even at rest */}
          <a
            className="quicknav__item quicknav__item--highlight"
            href={resolveNavHref('/news/consult')}
          >
            <span className="quicknav__icon" style={iconVar('무료법률상담')} aria-hidden="true" />
            <span className="quicknav__label">무료법률상담</span>
          </a>
        </div>

        {/* Compact-only affordance: tap to open the full rail */}
        <button
          type="button"
          className="quicknav__item quicknav__item--expand"
          onClick={expand}
          aria-label="빠른 메뉴 펼치기"
        >
          <span className="quicknav__icon" style={iconVar('펼쳐보기')} aria-hidden="true" />
        </button>

        <span className="quicknav__divider" aria-hidden="true" />

        <button type="button" className="quicknav__item" onClick={scrollTop}>
          <span className="quicknav__icon" style={iconVar('위로')} aria-hidden="true" />
          <span className="quicknav__label">위로</span>
        </button>
      </div>
    </nav>
  )
}
