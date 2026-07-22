import { useCallback, useEffect, useRef, useState } from 'react'
import { LocalTabs } from '../components/sub/LocalTabs'
import { SubVisual } from '../components/sub/SubVisual'
import {
  GALLERY_GRID,
  GALLERY_PAGE,
  GALLERY_PROMISE,
  GALLERY_PYRAMID,
  GALLERY_QUOTE,
  GALLERY_TABS,
  type GalleryTabId,
} from '../data/gallery'
import { LOCAL_TABS_ANCHOR_ID } from '../hooks/useScrollToLocalTabs'
import { asset } from '../utils/asset'
import './Gallery.css'

const QUOTE_SRC = asset('assets/icon-quote.svg')

function readGnbBarH(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--gnb-bar-h')
    .trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 100
}

function readLocalTabsH(): number {
  const el = document.getElementById(LOCAL_TABS_ANCHOR_ID)
  return el?.getBoundingClientRect().height ?? 62
}

function sectionId(id: GalleryTabId): string {
  return `gallery-section-${id}`
}

/**
 * 법무법인경국 > 경국인 · 갤러리 (sub-01-04).
 * Scroll-spy local tabs (경국인 / 갤러리) — click scrolls to the section under
 * the sticky tabs; GNB entry keeps the sub-visual at top. Same pattern as 법인소개.
 */
export function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTabId>('people')
  const scrollingRef = useRef(false)
  const mainRef = useRef<HTMLElement>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(sectionId(id as GalleryTabId))
    if (!el) return
    scrollingRef.current = true
    setActiveTab(id as GalleryTabId)
    const offset = readGnbBarH() + readLocalTabsH() + 8
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    window.setTimeout(() => {
      scrollingRef.current = false
    }, 700)
  }, [])

  useEffect(() => {
    const root = mainRef.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('[data-gallery-section]')
    if (!nodes.length) return

    const observe = () => {
      const offset = readGnbBarH() + readLocalTabsH() + 12
      const io = new IntersectionObserver(
        (entries) => {
          if (scrollingRef.current) return
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const first = visible[0]
          if (!first) return
          const id = first.target.getAttribute('data-gallery-section')
          if (id) setActiveTab(id as GalleryTabId)
        },
        { root: null, rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.1, 0.25] },
      )
      nodes.forEach((n) => io.observe(n))
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

  return (
    <div className="gallery" data-name="SUB_법무법인경국_경국인갤러리">
      <div className="gallery__visual" data-name="SUB_LAYOUT">
        <SubVisual
          parentLabel={GALLERY_PAGE.parentLabel}
          title={GALLERY_PAGE.title}
          image={GALLERY_PAGE.visual}
          imagePreview={GALLERY_PAGE.visualPreview}
          visualKey="sub-01-04"
        />
      </div>

      <LocalTabs
        tabs={GALLERY_TABS}
        activeTab={activeTab}
        onTabSelect={scrollToSection}
        ariaLabel="경국인 갤러리 로컬 메뉴"
      />

      <main ref={mainRef} className="gallery__main">
        {/* —— 경국인: pyramid + quote + 경국인의 약속 —— */}
        <section
          id={sectionId('people')}
          data-gallery-section="people"
          className="gallery-people"
          aria-label="경국인"
        >
          <div
            className="gallery-pyramid"
            role="img"
            aria-label={GALLERY_PYRAMID.alt}
          >
            <div
              className="gallery-pyramid__ring"
              style={{ backgroundImage: `url(${GALLERY_PYRAMID.ring})` }}
              aria-hidden="true"
            />
            <div className="gallery-pyramid__disc" aria-hidden="true" />
            <ul className="gallery-pyramid__stack">
              {GALLERY_PYRAMID.tiers.map((tier) => (
                <li
                  key={tier.id}
                  className={`gallery-pyramid__tier gallery-pyramid__tier--${tier.id}`}
                  style={{ width: `${tier.widthPct}%` }}
                  tabIndex={0}
                >
                  <img
                    className="gallery-pyramid__shape"
                    src={tier.shape}
                    alt=""
                    draggable={false}
                  />
                  <span className="gallery-pyramid__label">{tier.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="gallery-quote">
            <img className="gallery-quote__mark" src={QUOTE_SRC} alt="" />
            <p className="gallery-quote__lines">
              {GALLERY_QUOTE.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
            <img
              className="gallery-quote__mark gallery-quote__mark--close"
              src={QUOTE_SRC}
              alt=""
            />
            <p className="gallery-quote__strong">
              {GALLERY_QUOTE.strong.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
          </blockquote>

          <div className="gallery-promise">
            <div className="gallery-promise__head">
              <p className="gallery-promise__en">{GALLERY_PROMISE.enLabel}</p>
              <h2 className="gallery-promise__title">{GALLERY_PROMISE.title}</h2>
            </div>
            <ol className="gallery-promise__list">
              {GALLERY_PROMISE.items.map((it) => (
                <li key={it.no} className="gallery-promise__item">
                  <span className="gallery-promise__no">{it.no}</span>
                  <span className="gallery-promise__term">{it.en}</span>
                  <span className="gallery-promise__desc">{it.ko}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* —— 갤러리: masonry photo grid —— */}
        <section
          id={sectionId('gallery')}
          data-gallery-section="gallery"
          className="gallery-grid-section"
          aria-label="갤러리"
        >
          <div className="gallery-grid__head">
            <h2 className="gallery-grid__title">
              {GALLERY_GRID.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
          </div>
          <ul className="gallery-grid">
            {GALLERY_GRID.tiles.map((t) => (
              <li
                key={t.id}
                className={`gallery-tile${t.big ? ' gallery-tile--big' : ''}`}
                aria-label="경국인 갤러리 이미지 준비 중"
              />
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
