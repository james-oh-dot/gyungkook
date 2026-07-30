import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { asset } from '../utils/asset'
import { resolveNavHref } from '../utils/path'
import './QuickNav.css'

/**
 * quick-left-floating-Navigation (Figma `AI-quick` 120:974 / 120:1025).
 *
 * Tablet + mobile only (≤1024). Expanded pins bottom-left (20/20); compact
 * hugs `left: 0`. Panel is black liquid glass (not solid #111).
 *
 * Interaction contract — **scroll decides presence, the user decides size**:
 * - Presence is positional, not directional. Past `SHOW_AFTER` the rail slides
 *   in compact and then *stays* regardless of scroll direction; back at the
 *   top it slides out. (Direction-driven morphing made it twitch on every
 *   small reading correction and had no matching mental model.)
 * - Size is user-driven: tapping 펼쳐보기 toggles the full labelled rail.
 *   Scrolling never collapses it — except after a deliberate long jump
 *   (`AUTO_COLLAPSE_PX`, ~1 viewport) so it can't be left open forever.
 * - Also closes on outside tap, Escape, or picking an item.
 *
 * Icons are the uploaded `public/assets/{버튼명}.svg` files, painted via
 * `mask-image` + `background: currentColor` rather than `<img>`: each item
 * cycles four colours (default / hover / pressed / highlighted) and the SVGs
 * ship with their own hard-coded fills, which `<img>` could not recolour.
 */

type Mode = 'hidden' | 'compact' | 'expanded'

/** Below this the rail is considered "at the top" and hides again. */
const SHOW_AFTER = 120
/** Hysteresis so the show/hide edge can't flicker around the threshold. */
const HIDE_BEFORE = 80
/** Distance scrolled while open before the rail quietly collapses itself. */
const AUTO_COLLAPSE_PX = () => Math.round(window.innerHeight * 0.9)

const KAKAO_PC = 'http://pf.kakao.com/_twVnn'
const KAKAO_MOBILE = 'http://pf.kakao.com/_twVnn/chat'

/*
  ASCII copies of the uploaded `public/assets/{버튼명}.svg` files live in
  `public/assets/quick/`. Reference those, never the Korean originals: one of
  them (`펼쳐보기.svg`) is stored NFD-decomposed while the rest are NFC, so a
  composed `encodeURIComponent()` URL 404s and the icon silently disappears.
  Re-run the copy step (see AGENTS.md) whenever an icon is re-uploaded.
*/
function iconVar(name: string): CSSProperties {
  return {
    '--quicknav-icon': `url("${asset(`assets/quick/quick-${name}.svg`)}")`,
  } as CSSProperties
}

export function QuickNav() {
  const [onPage, setOnPage] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  /** scrollY when the rail was opened — drives the long-jump auto-collapse. */
  const openedAtRef = useRef(0)

  const mode: Mode = !onPage ? 'hidden' : open ? 'expanded' : 'compact'

  /* Presence: positional only. No direction tracking, so reading jitter
     (small up/down corrections) never moves the rail. */
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        setOnPage((was) => (was ? y > HIDE_BEFORE : y > SHOW_AFTER))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Leaving the page top closes the rail too — it should never reappear open. */
  useEffect(() => {
    if (!onPage) setOpen(false)
  }, [onPage])

  /* While open: outside tap / Escape close it, and a long scroll collapses it. */
  useEffect(() => {
    if (!open) return

    openedAtRef.current = window.scrollY

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (Math.abs(window.scrollY - openedAtRef.current) > AUTO_COLLAPSE_PX()) {
          setOpen(false)
        }
      })
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [open])

  const scrollTop = useCallback(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  const kakaoHref =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? KAKAO_MOBILE
      : KAKAO_PC

  return (
    <nav
      ref={rootRef}
      className={`quicknav quicknav--${mode}`}
      aria-label="빠른 메뉴"
      /* Off-screen state must not be reachable by keyboard or AT */
      aria-hidden={mode === 'hidden'}
      inert={mode === 'hidden'}
    >
      <div className="quicknav__panel">
        <div className="quicknav__full">
          <a className="quicknav__item" href={resolveNavHref('/about/location')} onClick={close}>
            <span className="quicknav__icon" style={iconVar('location')} aria-hidden="true" />
            <span className="quicknav__label">오시는길</span>
          </a>

          <a
            className="quicknav__item"
            href={kakaoHref}
            target="_blank"
            rel="noreferrer noopener"
            onClick={close}
          >
            <span className="quicknav__icon" style={iconVar('kakao')} aria-hidden="true" />
            <span className="quicknav__label">카톡문의</span>
          </a>

          <a className="quicknav__item" href={resolveNavHref('/news/consult')} onClick={close}>
            <span className="quicknav__icon" style={iconVar('case')} aria-hidden="true" />
            <span className="quicknav__label">진행사건문의</span>
          </a>

          {/* Figma `무료법률상담만하이라이트상태` — white even at rest */}
          <a
            className="quicknav__item quicknav__item--highlight"
            href={resolveNavHref('/news/consult')}
            onClick={close}
          >
            <span className="quicknav__icon" style={iconVar('consult')} aria-hidden="true" />
            <span className="quicknav__label">무료법률상담</span>
          </a>
        </div>

        {/* Compact-only affordance: tap to toggle the full rail */}
        <button
          type="button"
          className="quicknav__item quicknav__item--expand"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? '빠른 메뉴 접기' : '빠른 메뉴 펼치기'}
        >
          <span className="quicknav__icon" style={iconVar('expand')} aria-hidden="true" />
        </button>

        <span className="quicknav__divider" aria-hidden="true" />

        <button type="button" className="quicknav__item" onClick={scrollTop}>
          <span className="quicknav__icon" style={iconVar('top')} aria-hidden="true" />
          <span className="quicknav__label">위로</span>
        </button>
      </div>
    </nav>
  )
}
