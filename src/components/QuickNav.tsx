import { useCallback, useEffect, useRef, useState } from 'react'
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
 * Icons are inline SVG (not `public/assets/*.svg` via `<img>`) because each
 * item cycles four colours — default / hover / pressed / highlighted — and
 * `currentColor` handles that without per-state filter hacks.
 */

type Mode = 'hidden' | 'compact' | 'expanded'

/** Ignore sub-pixel/rubber-band jitter before flipping direction. */
const DIR_THRESHOLD = 6
/** Below this the rail is considered "at the top" and hides again. */
const SHOW_AFTER = 120

const KAKAO_PC = 'http://pf.kakao.com/_twVnn'
const KAKAO_MOBILE = 'http://pf.kakao.com/_twVnn/chat'

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4.5 3.5 6.8v12.7L9 17.2m0-12.7 6 2.3m-6-2.3v12.7m6-10.4 5.5-2.3v12.7L15 19.5m0-12.7v12.7m0 0-6-2.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconKakao() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.6c-4.4 0-8 2.7-8 6.1 0 2.2 1.5 4.1 3.7 5.2l-.9 3.2a.4.4 0 0 0 .6.44l3.8-2.5c.26.02.53.03.8.03 4.4 0 8-2.7 8-6.1s-3.6-6.1-8-6.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCaseQuestion() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.5 3.5H6.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V9l-5.5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.5 3.5V9H19" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M10.4 13.1a1.7 1.7 0 1 1 2.2 1.63c-.36.12-.6.45-.6.83v.34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18" r="0.85" fill="currentColor" />
    </svg>
  )
}

function IconConsult() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.5 3.5H6.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V9l-5.5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.5 3.5V9H19" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 12.2v3.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="18" r="0.85" fill="currentColor" />
    </svg>
  )
}

function IconTop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m7 13.5 5-5 5 5M7 18l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconExpand() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4.25"
        y="4.25"
        width="15.5"
        height="15.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 8.75v6.5M8.75 12h6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function QuickNav() {
  const [mode, setMode] = useState<Mode>('hidden')
  const lastYRef = useRef(0)
  const anchorRef = useRef(0)
  /** Set when the compact "펼치기" button is tapped — sticks until the next scroll down. */
  const forcedOpenRef = useRef(false)

  useEffect(() => {
    lastYRef.current = window.scrollY
    anchorRef.current = window.scrollY

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
          forcedOpenRef.current = false
          setMode('hidden')
          return
        }

        if (delta > 0) {
          /* Forward scroll — slide in (first time) / collapse back to compact */
          forcedOpenRef.current = false
          setMode('compact')
        } else {
          setMode('expanded')
        }
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

  const expand = useCallback(() => {
    forcedOpenRef.current = true
    setMode('expanded')
  }, [])

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
            <span className="quicknav__icon">
              <IconLocation />
            </span>
            <span className="quicknav__label">오시는길</span>
          </a>

          <a
            className="quicknav__item"
            href={kakaoHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="quicknav__icon">
              <IconKakao />
            </span>
            <span className="quicknav__label">카톡문의</span>
          </a>

          <a className="quicknav__item" href={resolveNavHref('/news/consult')}>
            <span className="quicknav__icon">
              <IconCaseQuestion />
            </span>
            <span className="quicknav__label">진행사건문의</span>
          </a>

          {/* Figma `무료법률상담만하이라이트상태` — white even at rest */}
          <a
            className="quicknav__item quicknav__item--highlight"
            href={resolveNavHref('/news/consult')}
          >
            <span className="quicknav__icon">
              <IconConsult />
            </span>
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
          <span className="quicknav__icon">
            <IconExpand />
          </span>
        </button>

        <span className="quicknav__divider" aria-hidden="true" />

        <button type="button" className="quicknav__item" onClick={scrollTop}>
          <span className="quicknav__icon">
            <IconTop />
          </span>
          <span className="quicknav__label">위로</span>
        </button>
      </div>
    </nav>
  )
}
